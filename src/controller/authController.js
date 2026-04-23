const User = require("../model/userModel.js");
const crypto = require("crypto");

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const hashPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).render("login", {
      errors: ["User Not Found."],
      oldInput: { email },
    });
  }

  if (user.password !== hashPassword) {
    return res.status(401).render("login", {
      errors: ["Invalid password."],
      oldInput: { email },
    });
  }

  req.session.userId = user._id;
  req.session.role = user.role;

  if (user.role === "admin") {
    return res.redirect("/admin-dashboard");
  }

  res.redirect("/eventlist");
};

exports.postsignUp = async (req, res, next) => {
  const { name, email, password, role, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.render("signup", {
      errors: ["Passwords do not match."],
      oldInput: { name, email, role },
    });
  }

  const hashPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  if (await User.findOne({ email })) {
    return res.render("signup", {
      errors: ["User Already Exists."],
      oldInput: { name },
    });
  }

  const user = new User({ name, email, password: hashPassword, role });
  await user.save();

  res.redirect("/login");
};
