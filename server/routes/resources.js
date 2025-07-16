const express = require("express");
const router = express.Router();
const resourcesController = require("../controllers/resourcesController");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

// @route   GET api/resources
// @desc    Get all resources
// @access  Private
router.get("/", auth, resourcesController.getResources);

// @route   GET api/resources/category/:category
// @desc    Get resources by category
// @access  Private
router.get(
  "/category/:category",
  auth,
  resourcesController.getResourcesByCategory
);

// @route   GET api/resources/:id
// @desc    Get a single resource
// @access  Private
router.get("/:id", auth, resourcesController.getResource);

// @route   POST api/resources
// @desc    Create a new resource (admin only)
// @access  Private/Admin
router.post("/", auth, resourcesController.createResource);

// Admin routes
router.put("/:id", [auth, adminAuth], resourcesController.updateResource);
router.delete("/:id", [auth, adminAuth], resourcesController.deleteResource);
router.put(
  "/:id/verify",
  [auth, adminAuth],
  resourcesController.verifyResource
);

module.exports = router;
