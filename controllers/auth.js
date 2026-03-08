const passport = require("passport");
const bcrypt = require("bcryptjs");
const prisma = require("../lib/prisma");

module.exports.getSignup = (req, res, next) => {
  res.render("html", { view: "signupForm" });
};

module.exports.postSignup = async (req, res, next) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      rootFolder: { create: { name: "root" } },
    },
  });
  res.redirect("/login");
};

module.exports.getLogin = (req, res, next) => {
  res.render("html", { view: "loginForm" });
};

module.exports.postLogin = [
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  }),
];

module.exports.getLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
