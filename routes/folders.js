const { Router } = require("express");
const c = require("../controllers/folders");
const { loggedIn } = require("../controllers/common");
const { validateId } = require("../controllers/validations");
const router = Router();

router.use("/", loggedIn);
router.get("/", c.getRootFolder);

router.use("/:id", validateId, c.hasAccess);
router.get("/:id", c.getFolder);
router.patch("/:id", c.patchFolder);
router.delete("/:id", c.deleteFolder);
router.post("/:id/folder", c.postFolder);
router.post("/:id/file", c.postFile);

module.exports = router;
