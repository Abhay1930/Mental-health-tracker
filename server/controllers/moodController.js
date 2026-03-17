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

exports.getPrediction = async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user.id }).sort({ date: -1 }).limit(1);
    const last = moods[0];

    const payload = {
      sleep_hours: last?.sleepHours || 7,
      stress_level: last?.anxiety || 5,
      exercise_minutes: last?.physicalActivity || 30,
      social_interaction_level: last?.socialInteraction || 5,
      screen_time_hours: 4,
      journal_sentiment_score: 0,
      prev_mood: last?.mood || 5
    };

    const response = await fetch('http://127.0.0.1:5006/predict-mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error('ML Service Error');
    res.json(await response.json());
  } catch (err) {
    console.error('Mood Prediction failed:', err.message);
    res.status(503).json({ msg: "Service unavailable" });
  }
};

exports.getFuturePrediction = async (req, res) => {
  try {
    const rawMoods = await Mood.find({ user: req.user.id }).sort({ date: -1 }).limit(7);
    
    // Reverse and map to feature format
    let history = rawMoods.reverse().map(m => ({
      sleep_hours: m.sleepHours || 7,
      stress_level: m.anxiety || 5,
      exercise_minutes: m.physicalActivity || 30,
      social_interaction_level: m.socialInteraction || 5,
      screen_time_hours: 4,
      journal_sentiment_score: 0,
      mood_score: m.mood || 5
    }));
    
    // Ensure we have exactly 7 entries
    while (history.length < 7) {
      history.unshift({
        sleep_hours: 7,
        stress_level: 5,
        exercise_minutes: 30,
        social_interaction_level: 5,
        screen_time_hours: 4,
        journal_sentiment_score: 0,
        mood_score: 5
      });
    }

    const response = await fetch('http://127.0.0.1:5006/predict_future', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history })
    });

    if (!response.ok) throw new Error('Forecast failed');
    res.json(await response.json());
  } catch (err) {
    console.error('Future Prediction failed:', err.message);
    res.status(503).json({ msg: "Forecasting unavailable" });
  }
};
