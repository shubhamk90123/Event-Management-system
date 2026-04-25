const { body, validationResult } = require("express-validator");

// Helper to handle validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  // If there are errors, render the current page with error messages
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push(err.msg));

  // Determine which view to render based on the path
  const viewMap = {
    "/login": "login",
    "/signup": "signup",
    "/create-event": "createEvent",
  };

  const view = viewMap[req.path] || "error";
  
  return res.status(422).render(view, {
    errors: extractedErrors,
    oldInput: req.body,
  });
};

// Signup validation rules
const signupValidationRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

// Login validation rules
const loginValidationRules = [
  body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

// Event creation validation rules
const eventValidationRules = [
  body("name").trim().notEmpty().withMessage("Event name is required"),
  body("date").isISO8601().withMessage("Invalid date format").toDate(),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("details").trim().notEmpty().withMessage("Event details are required"),
];

module.exports = {
  signupValidationRules,
  loginValidationRules,
  eventValidationRules,
  validate,
};
