const mongoose = require("mongoose");
const Event = require("../models/mongo/Event");
const { Booking, User } = require("../models/mysql");
const { Sequelize } = require("sequelize");

exports.bookTicket = async (req, res) => {
  const userId = req.user.id;
  const { eventId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: "Invalid eventId" });
  }

  // 1) Atomic decrement only if tickets remain
  const updated = await Event.findOneAndUpdate(
    { _id: eventId, totalTickets: { $gte: 1 } },
    { $inc: { totalTickets: -1 } },
    { new: true }
  );

  if (!updated) {
    return res.status(409).json({ message: "Sold out" });
  }

  // 2) Create booking in MySQL
  try {
    const booking = await Booking.create({ userId, eventId, quantity: 1 });
    return res.status(201).json({
      id: booking.id,
      eventId: booking.eventId,
      quantity: booking.quantity,
      createdAt: booking.createdAt,
      eventName: updated.title,
    });
  } catch (err) {
    // 3) Compensating rollback (best-effort)
    await Event.updateOne({ _id: eventId }, { $inc: { totalTickets: 1 } });
    throw err;
  }
};

exports.myTickets = async (req, res) => {
  try {
 const userId = req.user.id;

  // 1️⃣ Aggregate bookings in MySQL (GROUP BY eventId)
  const bookings = await Booking.findAll({
    attributes: [
      "eventId",
      [Sequelize.fn("SUM", Sequelize.col("quantity")), "quantity"],
      [Sequelize.fn("MAX", Sequelize.col("createdAt")), "lastBookedAt"],
    ],
    where: { userId },
    group: ["eventId"],
    order: [[Sequelize.fn("MAX", Sequelize.col("createdAt")), "DESC"]],
    raw: true,
  });

  // 2️⃣ Fetch event titles from Mongo (batch)
  const eventIds = bookings.map(b => b.eventId);
  const events = await Event.find(
    { _id: { $in: eventIds } },
    { title: 1 }
  ).lean();

  const eventMap = new Map(events.map(e => [String(e._id), e.title]));

  // 3️⃣ Final response (grouped)
  res.json(
    bookings.map(b => ({
      eventId: b.eventId,
      eventName: eventMap.get(String(b.eventId)) || null,
      quantity: Number(b.quantity),
      lastBookedAt: b.lastBookedAt,
    }))
  );
  }catch (err) {
    console.error("myTickets error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
 
};
