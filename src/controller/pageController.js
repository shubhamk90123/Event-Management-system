exports.getIndex = (req, res, next) => {
  return res.render("index");
};

exports.getLogin = (req, res, next) => {
  return res.render("login", { errors: [], oldInput: {} });
};

exports.getsignUp = (req, res, next) => {
  return res.render("signup", { errors: [], oldInput: {} });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    return res.redirect("/");
  });
};
