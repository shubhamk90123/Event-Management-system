const express = require("express");
const { postLogin, postsignUp } = require("../controller/authController");
const {
  signupValidationRules,
  loginValidationRules,
  validate,
} = require("../middlewares/validationMiddleware");

const authRouter = express.Router();

authRouter.post("/login", loginValidationRules, validate, postLogin);
authRouter.post("/signup", signupValidationRules, validate, postsignUp);

module.exports = authRouter;