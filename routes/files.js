const { Router } = require("express");
const c = require("../controllers/files");
const { loggedIn } = require("../controllers/common");
const { validateId } = require("../controllers/validations");
const router = Router();

router.use("/", loggedIn);
router.use("/:id", validateId, c.hasAccess);
router.get("/:id", c.getFile);
router.get("/:id/download", c.downloadFile);

module.exports = router;
