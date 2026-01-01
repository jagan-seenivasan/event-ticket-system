const router = require("express").Router();
const Joi = require("joi");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const ctrl = require("../controllers/event.controller");

router.post("/",
  auth,
  admin,
  validate(Joi.object({
    title: Joi.string().max(200).required(),
    description: Joi.string().max(2000).required(),
    date: Joi.date().required(),
    location: Joi.string().max(200).required(),
    totalTickets: Joi.number().integer().min(0).required(),
    metadata: Joi.object().unknown(true).default({}),
  })),
  ctrl.createEvent
);

router.get("/", ctrl.listEvents);

module.exports = router;
