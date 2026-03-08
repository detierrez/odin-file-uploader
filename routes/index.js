const { Router } = require("express");
const controller = require("../controllers/index");
const router = Router();

router.get("/", controller.getIndex);
router.post("/", controller.postIndex);

module.exports = router;
