const express = require("express");
const router = express.Router();
const moodController = require("../controllers/moodController");
const auth = require("../middleware/auth");

router.post("/", auth, moodController.createMood);

router.get("/", auth, moodController.getMoods);

router.get("/:id", auth, moodController.getMood);
router.get("/predict/tomorrow", auth, moodController.getPrediction);
router.put("/:id", auth, moodController.updateMood);

router.delete("/:id", auth, moodController.deleteMood);

module.exports = router;
