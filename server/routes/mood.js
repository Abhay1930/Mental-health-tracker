const express = require("express");
const router = express.Router();
const moodController = require("../controllers/moodController");
const auth = require("../middleware/auth");

// @route   POST api/mood
// @desc    Create a mood entry
// @access  Private
router.post("/", auth, moodController.createMood);

// @route   GET api/mood
// @desc    Get all mood entries for a user
// @access  Private
router.get("/", auth, moodController.getMoods);

// @route   GET api/mood/:id
// @desc    Get a single mood entry
// @access  Private
router.get("/:id", auth, moodController.getMood);

// @route   PUT api/mood/:id
// @desc    Update a mood entry
// @access  Private
router.put("/:id", auth, moodController.updateMood);

// @route   DELETE api/mood/:id
// @desc    Delete a mood entry
// @access  Private
router.delete("/:id", auth, moodController.deleteMood);

module.exports = router;
