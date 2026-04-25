const User = require("../model/userModel.js");

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).render("login", {
        errors: ["Invalid email or password."],
        oldInput: { email },
      });
    }

    // Regenerate session to prevent session fixation
    req.session.regenerate((err) => {
      if (err) return next(err);

      req.session.userId = user._id;
      req.session.role = user.role;

      if (user.role === "admin") {
        return res.redirect("/admin-dashboard");
      }

      res.redirect("/eventlist");
    });
  } catch (err) {
    next(err);
  }
};

exports.postsignUp = async (req, res, next) => {
  try {
    const { name, email, password, role, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.render("signup", {
        errors: ["Passwords do not match."],
        oldInput: { name, email, role },
      });
    }

    if (await User.findOne({ email })) {
      return res.render("signup", {
        errors: ["User Already Exists."],
        oldInput: { name, email, role },
      });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    res.redirect("/login");
  } catch (err) {
    next(err);
  }
};
