const express = require("express");
const router = express.Router();
const resourcesController = require("../controllers/resourcesController");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

router.get("/", auth, resourcesController.getResources);

router.get(
  "/category/:category",
  auth,
  resourcesController.getResourcesByCategory
);

router.get("/:id", auth, resourcesController.getResource);

router.post("/", auth, resourcesController.createResource);

router.put("/:id", [auth, adminAuth], resourcesController.updateResource);
router.delete("/:id", [auth, adminAuth], resourcesController.deleteResource);
router.put(
  "/:id/verify",
  [auth, adminAuth],
  resourcesController.verifyResource
);

module.exports = router;
