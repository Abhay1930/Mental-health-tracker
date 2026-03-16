const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { validateApiKey } = require("./services/aiService");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB and validate OpenAI API key
Promise.all([
  mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/mental-health-app"
  ),
  validateApiKey(),
])
  .then(([mongoConnection, isApiKeyValid]) => {
    console.log("MongoDB connected");
    if (!isApiKeyValid) {
      console.warn("OpenAI features will be disabled due to invalid API key");
    }
  })
  .catch((err) => {
    console.error("Startup error:", err);
  });

// Import routes
const authRoutes = require("./routes/auth");
const moodRoutes = require("./routes/mood");
const resourcesRoutes = require("./routes/resources");
const exercisesRoutes = require("./routes/exercises");
const journalRoutes = require("./routes/journal");
const goalsRoutes = require("./routes/goals");
const postsRoutes = require("./routes/posts");
const aiRoutes = require("./routes/ai");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/resources", resourcesRoutes);
app.use("/api/exercises", exercisesRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/ai", aiRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  });
}

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
