const router = require("express").Router();
const Joi = require("joi");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const ctrl = require("../controllers/booking.controller");

router.post("/",
  auth,
  validate(Joi.object({ eventId: Joi.string().required() })),
  ctrl.bookTicket
);

router.get("/me", auth, ctrl.myTickets);

module.exports = router;
