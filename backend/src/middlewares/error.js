const Log = require("../models/mongo/Log");

module.exports = async (err, req, res, next) => {
  await Log.create({
    level: "ERROR",
    message: err.message,
    context: {
      path: req.originalUrl,
      method: req.method,
    },
  });

  res.status(500).json({ message: "Internal server error" });
};
