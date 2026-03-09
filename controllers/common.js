module.exports.loggedIn = (req, res, next) => {
  if (!req.user) return res.redirect("/login");
  next();
};

module.exports.loggedOut = (req, res, next) => {
  if (req.user) return res.redirect("/folders");
  next();
};
