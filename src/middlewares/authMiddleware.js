exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  res.redirect("/login");
};

exports.isAdmin = (req, res, next) => {
  if (req.session && req.session.role === "admin") {
    return next();
  }
  res.redirect("/eventlist");
};
