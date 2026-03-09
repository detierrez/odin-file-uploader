const passport = require("passport");
const bcrypt = require("bcryptjs");
const prisma = require("../lib/prisma");

module.exports.getSignup = (req, res, next) => {
  res.render("html", { view: "signupForm" });
};

module.exports.postSignup = async (req, res, next) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const rootFolder = await prisma.folder.create({
    data: {
      name: "root",
      owner: { create: { username, password: hashedPassword } },
    },
  });
  await prisma.user.update({
    data: { rootFolderId: rootFolder.id },
    where: { id: rootFolder.ownerId },
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
