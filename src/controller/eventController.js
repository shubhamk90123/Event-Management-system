const mongoose = require("mongoose");
const Event = require("../model/eventModel");

exports.getEventList = async (req, res, next) => {
  const events = await Event.find();
  res.render("eventlist", { events });
};

exports.getCreateEvent = (req, res, next) => {
  res.render("createEvent");
};

exports.postCreateEvent = async (req, res, next) => {
  const { name, date, location, details } = req.body;
  const event = new Event({ name, date, location, details, createdBy: req.session.userId });
  await event.save();
  res.redirect("/admin-dashboard");
};  

exports.getAdminDashboard = async (req, res, next) => {
  const events = await Event.find();
  const selectedEventId = req.query.eventId || null;
  let selectedEvent = null;

  if (selectedEventId) {
    selectedEvent = await Event.findById(selectedEventId).populate(
      "attendees",
      "name email",
    );
  }

  res.render("adminDashboard", { events, selectedEvent, selectedEventId });
};

exports.deleteEvent = async (req, res, next) => {
  const { eventId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).send("Invalid Event ID");
  }
  await Event.findByIdAndDelete(eventId);
  res.redirect("/admin-dashboard");
};

exports.postBookEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const userId = req.session.userId;

    if (!userId) return res.redirect("/login");

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).send("Invalid Event ID");
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).send("Event not found");

    if (event.attendees.includes(userId)) {
      return res.redirect("/eventlist");
    }

    event.attendees.push(userId);
    await event.save();

    res.redirect("/eventlist");
  } catch (err) {
    next(err);
  }
};













