const mongoose = require("mongoose");
const Event = require("../model/eventModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getEventList = catchAsync(async (req, res, next) => {
  const events = await Event.find();
  return res.render("eventlist", { events });
});

exports.getCreateEvent = (req, res, next) => {
  return res.render("createEvent");
};

exports.postCreateEvent = catchAsync(async (req, res, next) => {
  const { name, date, location, details } = req.body;
  const event = new Event({
    name,
    date,
    location,
    details,
    createdBy: req.session.userId,
  });
  await event.save();
  return res.redirect("/admin-dashboard");
});

exports.getAdminDashboard = catchAsync(async (req, res, next) => {
  const events = await Event.find();
  const selectedEventId = req.query.eventId || null;
  let selectedEvent = null;

  if (selectedEventId) {
    if (!mongoose.Types.ObjectId.isValid(selectedEventId)) {
      return next(new AppError("Invalid Event ID", 400));
    }

    selectedEvent = await Event.findById(selectedEventId).populate(
      "attendees",
      "name email",
    );

    if (!selectedEvent) {
      return next(new AppError("Event not found", 404));
    }
  }

  return res.render("adminDashboard", {
    events,
    selectedEvent,
    selectedEventId,
  });
});

exports.deleteEvent = catchAsync(async (req, res, next) => {
  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return next(new AppError("Invalid Event ID", 400));
  }

  const event = await Event.findByIdAndDelete(eventId);

  if (!event) {
    return next(new AppError("Event not found", 404));
  }

  return res.redirect("/admin-dashboard");
});

exports.postBookEvent = catchAsync(async (req, res, next) => {
  const { eventId } = req.params;
  const userId = req.session.userId;

  if (!userId) {
    return res.redirect("/login");
  }

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return next(new AppError("Invalid Event ID", 400));
  }

  const event = await Event.findById(eventId);

  if (!event) {
    return next(new AppError("Event not found", 404));
  }

  if (event.attendees.includes(userId)) {
    return res.redirect("/eventlist");
  }

  event.attendees.push(userId);
  await event.save();

  return res.redirect("/eventlist");
});
