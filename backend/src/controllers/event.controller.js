const Event = require("../models/mongo/Event");

exports.createEvent = async (req, res) => {
  const event = await Event.create(req.body);
  res.status(201).json(event);
};

exports.listEvents = async (req, res) => {

  try{
const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(50, Math.max(1, Number(req.query.limit || 10)));
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Event.find({}).sort({ date: 1 }).skip(skip).limit(limit),
    Event.countDocuments({}),
  ]);

  res.json({ page, limit, total, items });
  }catch(err) {
    console.error("listEvents error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
  
};
