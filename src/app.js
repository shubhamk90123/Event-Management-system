const express = require("express");
const path = require("path");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const csrf = require("csurf");
const compression = require("compression");
const mongoose = require("mongoose");

const app = express();

// Config Imports
const sessionConfig = require("./config/session");
const { globalLimiter, authLimiter } = require("./config/limiter");

// Utility Imports
const AppError = require("./utils/appError");

//Allows proxy
app.set("trust proxy", 1);

// Router Imports
const pageRouter = require("./routes/pageRoute");
const eventRouter = require("./routes/eventRoute");
const authRouter = require("./routes/authRouter");

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

// CSRF error handler: turn csurf errors into friendly responses
app.use((err, req, res, next) => {
  if (err.code !== "EBADCSRFTOKEN") {
    return next(err);
  }

  return next(
    new AppError(
      "Invalid or expired security token. Please refresh the page and try again.",
      403,
    ),
  );
});

// --- Routes ---
app.use(pageRouter);
app.use(eventRouter);
app.use(authRouter);

// --- Error Handling ---

// Normalize common error types into friendly AppError instances
const normalizeError = (err) => {
  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    return new AppError(messages.join(". "), 400);
  }

  // Mongoose cast error (e.g. invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    return new AppError(`Invalid value for ${err.path}: ${err.value}`, 400);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {}).join(", ") || "field";
    return new AppError(`An account with that ${field} already exists.`, 409);
  }

  // JWT-ish or generic unauthorized errors
  if (err.name === "UnauthorizedError") {
    return new AppError("You are not authorized to perform this action.", 401);
  }

  return err;
};

// 404 handler
app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.method} ${req.originalUrl}`, 404));
});

// Global Error Handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  err = normalizeError(err);

  const statusCode = err.statusCode || err.status || 500;
  const isProduction = process.env.NODE_ENV === "production";
  const isOperational = err.isOperational === true;

  // Log every error on the server
  console.error(
    `[ERROR ${statusCode}] ${req.method} ${req.originalUrl}\n`,
    err.stack || err,
  );

  // Build user-facing details
  const title = statusCode === 404 ? "Page Not Found" : "Something Went Wrong";
  const message = isProduction && !isOperational
    ? "We encountered an unexpected issue. Please try again later."
    : err.message || "An unknown error occurred.";

  // JSON response for API/AJAX requests
  if (req.xhr || req.headers.accept?.includes("application/json")) {
    return res.status(statusCode).json({
      status: err.status || "error",
      statusCode,
      title,
      message,
      ...(isProduction ? {} : { stack: err.stack }),
    });
  }

  // HTML response
  return res.status(statusCode).render("error", {
    title,
    statusCode,
    message,
    stack: isProduction ? null : err.stack,
    isDevelopment: !isProduction,
  });
});

module.exports = app;
