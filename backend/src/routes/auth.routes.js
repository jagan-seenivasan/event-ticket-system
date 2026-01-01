const router = require("express").Router();
const Joi = require("joi");
const validate = require("../middlewares/validate");
const ctrl = require("../controllers/auth.controller");
const requireAdmin = require("../middlewares/requireAdmin");
const auth = require("../middlewares/auth");
const { listAllBookings } = require("../controllers/admin.controller");

router.post("/register",
  validate(Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().max(150).required(),
    password: Joi.string().min(8).max(72).required(),
  })),
  ctrl.register
);

router.post("/login",
  validate(Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  })),
  ctrl.login
);

router.get("/bookings", auth, requireAdmin, listAllBookings);

module.exports = router;
