const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const auth = require("../middleware/auth");
const rateLimit = require("express-rate-limit");
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
});
router.post("/chat", [auth, aiLimiter], aiController.chatWithAgent);
router.post(
  "/suggest-exercise",
  [auth, aiLimiter],
  aiController.getExerciseSuggestion
);

module.exports = router;
