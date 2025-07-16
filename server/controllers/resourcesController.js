const Resource = require("../models/Resource");

// Get all resources
exports.getResources = async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get resources by category
exports.getResourcesByCategory = async (req, res) => {
  try {
    const resources = await Resource.find({
      category: req.params.category,
    }).sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get a single resource
exports.getResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ msg: "Resource not found" });
    }

    res.json(resource);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Resource not found" });
    }
    res.status(500).send("Server error");
  }
};

// Create a new resource (admin only)
exports.createResource = async (req, res) => {
  try {
    const { title, description, category, contactInfo } = req.body;

    const newResource = new Resource({
      title,
      description,
      category,
      contactInfo,
    });

    const resource = await newResource.save();
    res.json(resource);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Update a resource (admin only)
exports.updateResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $set: req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({ msg: "Resource not found" });
    }

    res.json(resource);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Delete a resource (admin only)
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);

    if (!resource) {
      return res.status(404).json({ msg: "Resource not found" });
    }

    res.json({ msg: "Resource removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Verify a resource (admin only)
exports.verifyResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $set: { isVerified: true, updatedAt: Date.now() } },
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({ msg: "Resource not found" });
    }

    res.json(resource);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
