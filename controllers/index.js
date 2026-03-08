const multer = require("multer");
const upload = multer({ dest: "uploads/" });

module.exports.getIndex = [
  (req, res) => {
    res.render("html", { view: "index" });
  },
];

module.exports.postIndex = [
  upload.single("avatar"),
  (req, res) => {
    console.log(req.file);
    res.redirect("/");
  },
];
