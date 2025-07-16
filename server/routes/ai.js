const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const auth = require("../middleware/auth");
const rateLimit = require("express-rate-limit");

// Rate limiting for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
});

// Chat with AI agent
router.post("/chat", [auth, aiLimiter], aiController.chatWithAgent);

// Get exercise suggestion
router.post(
  "/suggest-exercise",
  [auth, aiLimiter],
  aiController.getExerciseSuggestion
);

module.exports = router;
