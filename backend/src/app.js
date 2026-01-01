require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const errorMiddleware = require("./middlewares/error");

const authRoutes = require("./routes/auth.routes");
const eventRoutes = require("./routes/event.routes");
const bookingRoutes = require("./routes/booking.routes");


const app = express();

// Body parsing
app.use(express.json({ limit: "1mb" }));

// Headers protection (XSS/clickjacking/etc.)
app.use(helmet());

// CORS: allow only known client
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",") || [],
  credentials: true,
}));

// Traffic control (global)
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 120,
}));

// Optional request logging
app.use(morgan("combined"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", authRoutes);

// Health
app.get("/health", (req, res) => res.json({ ok: true }));

// Global error handler (must be last)
app.use(errorMiddleware);

module.exports = app;
