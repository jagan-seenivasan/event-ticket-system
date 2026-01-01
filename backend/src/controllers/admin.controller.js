const sequelize = require("../config/mysql");
const Event = require("../models/mongo/Event"); // your Event model (mongo)

exports.listAllBookings = async (req, res) => {
  try{
const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10), 1), 100);
  const offset = (page - 1) * limit;

 const [rows] = await sequelize.query(
  `
  SELECT 
    b.userId,
    b.eventId,
    SUM(b.quantity) AS quantity,
    MAX(b.createdAt) AS lastBookedAt,
    u.name AS userName,
    u.email AS userEmail
  FROM bookings b
  JOIN users u ON u.id = b.userId
  GROUP BY b.userId, b.eventId
  ORDER BY lastBookedAt DESC
  LIMIT :limit OFFSET :offset
  `,
  { replacements: { limit, offset } }
);

const [[countRow]] = await sequelize.query(`
  SELECT COUNT(*) AS total
  FROM (
    SELECT 1
    FROM bookings
    GROUP BY userId, eventId
  ) x
`);
const total = countRow.total;


  // 2) fetch event details from Mongo
  const eventIds = [...new Set(rows.map(r => r.eventId))];
  const events = await Event.find({ _id: { $in: eventIds } })
    .select("_id title date location")
    .lean();

  const eventMap = new Map(events.map(e => [String(e._id), e]));

  // 3) shape response
  const items = rows.map(r => ({
    id: r.id,
    quantity: r.quantity,
    createdAt: r.createdAt,
    user: { id: r.userId, name: r.userName, email: r.userEmail },
    lastBookedAt: r.lastBookedAt,
    event: eventMap.get(String(r.eventId)) || { _id: r.eventId, title: "(Deleted/Unknown)" }
  }));

  res.json({ page, limit, total, items });
  }catch(err) {
    console.error("listAllBookings error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
  
};
