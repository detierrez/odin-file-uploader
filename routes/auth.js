const { Router } = require("express");
const controller = require("../controllers/auth");
const { loggedOut, loggedIn } = require("../controllers/common");

const router = Router();

router.all(["/signup", "/login"], loggedOut);
router.get("/signup", controller.getSignup);
router.post("/signup", controller.postSignup);
router.get("/login", controller.getLogin);
router.post("/login", controller.postLogin);

router.get("/logout", loggedIn, controller.getLogout);

module.exports = router;
