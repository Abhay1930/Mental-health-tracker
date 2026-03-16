const Mood = require("../models/Mood");

exports.createMood = async (req, res) => {
  try {
    const { mood, activities, notes, factors } = req.body;

    const newMood = new Mood({
      user: req.user.id,
      mood,
      activities,
      notes,
      factors,
    });

    const savedMood = await newMood.save();
    res.json(savedMood);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getMoods = async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user.id }).sort({ date: -1 });
    res.json(moods);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getMood = async (req, res) => {
  try {
    const mood = await Mood.findById(req.params.id);

    if (!mood) {
      return res.status(404).json({ msg: "Mood entry not found" });
    }

    if (mood.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    res.json(mood);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Mood entry not found" });
    }
    res.status(500).send("Server error");
  }
};

exports.updateMood = async (req, res) => {
  try {
    let mood = await Mood.findById(req.params.id);

    if (!mood) {
      return res.status(404).json({ msg: "Mood entry not found" });
    }

    if (mood.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    mood = await Mood.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(mood);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteMood = async (req, res) => {
  try {
    const mood = await Mood.findById(req.params.id);

    if (!mood) {
      return res.status(404).json({ msg: "Mood entry not found" });
    }

    if (mood.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await mood.deleteOne();
    res.json({ msg: "Mood entry removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Mood entry not found" });
    }
    res.status(500).send("Server error");
  }
};
