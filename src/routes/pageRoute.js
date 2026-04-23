const pageRouter = require("express").Router();

const {
  getLogin,
  getsignUp,
  getIndex,
  postLogout,
} = require("../controller/pageController");

pageRouter.get("/", getIndex);
pageRouter.get("/login", getLogin);
pageRouter.get("/signup", getsignUp);
pageRouter.post("/logout", postLogout);

module.exports = pageRouter;
