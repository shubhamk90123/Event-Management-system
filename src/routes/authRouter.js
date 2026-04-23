const express = require("express");
const { postLogin, postsignUp } = require("../controller/authController");

const authRouter = express.Router();

authRouter.post("/login", postLogin);
authRouter.post("/signup", postsignUp);

module.exports = authRouter;  