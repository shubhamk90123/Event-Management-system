exports.getIndex = (req, res, next) => {
  res.render("index");
};

exports.getLogin = (req, res, next) => {
  res.render("login", { errors: [], oldInput: {} });
};

exports.getsignUp = (req, res, next) => {
  res.render("signup", { errors: [], oldInput: {} });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
