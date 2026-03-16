const mongoose = require("mongoose");
const Resource = require("./models/Resource");
const { resources } = require("./data/seedData");
require("dotenv").config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/mental-health-app"
    );
    console.log("Connected to MongoDB...");

    // Clear existing data
    await Resource.deleteMany({});
    console.log("Cleared existing resources...");

    // Insert seed data
    await Resource.insertMany(resources);
    console.log("Seed data inserted successfully!");

    await mongoose.disconnect();
    console.log("Database seeded! 🌱");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
