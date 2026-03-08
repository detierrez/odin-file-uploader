const multer = require("multer");
const prisma = require("../lib/prisma");
const upload = multer({ dest: "uploads/" });

module.exports.getIndex = [
  (req, res) => {
    if (req.user) {
      return res.redirect("/folders");
    }
    res.render("html", { view: "index" });
  },
];

module.exports.postIndex = [
  (req, res) => {
    res.redirect("/");
  },
];
