const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema(
  {
    level: { type: String, enum: ["INFO", "WARN", "ERROR"], required: true },
    message: { type: String, required: true },
    context: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Log", LogSchema);
