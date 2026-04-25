const express = require("express");
const path = require("path");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const csrf = require("csurf");
const compression = require("compression");

// Config Imports
const sessionConfig = require("./config/session");
const { globalLimiter, authLimiter } = require("./config/limiter");

// Router Imports
const pageRouter = require("./routes/pageRoute");
const eventRouter = require("./routes/eventRoute");
const authRouter = require("./routes/authRouter");

const app = express();

// --- Security & Performance Middlewares ---
app.use(helmet()); 
app.use(compression());

// Express 5 compatibility shim for mongoSanitize
app.use((req, res, next) => {
  Object.defineProperty(req, "query", {
    value: { ...req.query },
    writable: true,
    enumerable: true,
    configurable: true,
  });
  next();
});

app.use(globalLimiter);
app.use("/login", authLimiter);
app.use("/signup", authLimiter);

// --- View Engine & Static Files ---
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "../public")));

// --- Body Parsing & Sanitization ---
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(mongoSanitize()); 

// --- Session & CSRF ---
app.use(sessionConfig);

const csrfProtection = csrf();
app.use(csrfProtection);

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// --- Routes ---
app.use(pageRouter);
app.use(eventRouter);
app.use(authRouter);

// --- Error Handling ---
// 404 handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    console.error(`[ERROR] ${err.message}\n${err.stack}`);
  }


  res.status(statusCode).render("404", {
    title: statusCode === 404 ? "Page Not Found" : "Server Error",
    message: isProduction ? "Something went wrong!" : err.message,
    error: isProduction ? {} : err,
  });
});

module.exports = app;
