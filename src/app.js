const express = require("express");
const path = require("path");
const session = require("express-session");

const app = express();

// Local Modules
const pageRouter = require("./routes/pageRoute");
const eventRouter = require("./routes/eventRoute");
const authRouter = require("./routes/authRouter");

// Middlewares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: false,
    },
  }),
);

// Routes
app.use(pageRouter);
app.use(eventRouter);
app.use(authRouter);

// 404 error handling
app.use((req, res, next) => {
  res.status(404).render("404");
});

module.exports = app;
