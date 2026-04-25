const express = require("express");
const eventRouter = express.Router();
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");

const {
  getEventList,
  getCreateEvent,
  getAdminDashboard,
  postCreateEvent,
  deleteEvent,
  postBookEvent,
} = require("../controller/eventController");

const {
  signupValidationRules,
  loginValidationRules,
  eventValidationRules,
  validate,
} = require("../middlewares/validationMiddleware");

eventRouter.get("/eventlist", isAuthenticated, getEventList);

eventRouter.get("/create-event", isAuthenticated, isAdmin, getCreateEvent);

eventRouter.post(
  "/create-event",
  isAuthenticated,
  isAdmin,
  eventValidationRules,
  validate,
  postCreateEvent,
);

eventRouter.post(
  "/delete-event/:eventId",
  isAuthenticated,
  isAdmin,
  deleteEvent,
);

eventRouter.post("/book-event/:eventId", isAuthenticated, postBookEvent);

eventRouter.get(
  "/admin-dashboard",
  isAuthenticated,
  isAdmin,
  getAdminDashboard,
);

module.exports = eventRouter;
