const { Router } = require("express");
const { loggedOut } = require("../controllers/common");
const router = Router();

router.get("/", loggedOut, (req, res) => res.render("html", { view: "index" }));

module.exports = router;
