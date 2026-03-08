const { Router } = require("express");
const controller = require("../controllers/files");
const router = Router();

router.get("/:id", controller.getFile);
router.get("/:id/download", controller.downloadFile);

module.exports = router;
