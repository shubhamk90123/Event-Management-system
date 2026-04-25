const session = require("express-session");

const sessionConfig = session({
  secret: process.env.SESSION_SECRET || "secure_event_manager_secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
});

module.exports = sessionConfig;
