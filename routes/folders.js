const { Router } = require("express");
const controller = require("../controllers/folders");
const router = Router();

router.get("/", controller.getRootFolder);
router.get("/:id", controller.getFolder);
router.patch("/:id", controller.patchFolder);
router.post("/:id/folder", controller.postFolder);
router.post("/:id/file", controller.postFile);

module.exports = router;
