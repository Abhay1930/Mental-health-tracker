const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { validateApiKey } = require("./services/aiService");

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});


// Connect to MongoDB
console.log("Connecting to MongoDB...");
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/mental-health-app"
)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Validate AI Service
console.log("Initializing AI service...");
validateApiKey()
  .then(isValid => {
    if (isValid) {
      console.log("AI service initialized successfully");
    } else {
      console.warn("OpenAI features will be disabled due to invalid API key");
    }
  })
  .catch(err => console.error("AI service error:", err));


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

app.get("/api/health", (req, res) => res.json({ status: 'ok' }));


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
