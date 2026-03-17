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
    console.log('Prediction requested for user:', req.user.id);
    const moods = await Mood.find({ user: req.user.id }).sort({ date: -1 }).limit(1);
    const lastMood = moods.length > 0 ? moods[0] : null;

    console.log('Last mood entry:', lastMood ? 'found' : 'not found, using defaults');

    const predictionData = {
      sleep_hours: lastMood?.sleepHours || 7,
      stress_level: lastMood?.anxiety || 5,
      exercise_minutes: lastMood?.physicalActivity || 30,
      social_interaction_level: lastMood?.socialInteraction || 5,
      screen_time_hours: 4,
      journal_sentiment_score: 0,
      prev_mood: lastMood?.mood || 5
    };

    const response = await fetch('http://127.0.0.1:5006/predict-mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(predictionData)
    });

    if (!response.ok) {
      throw new Error('ML Service unreachable');
    }

    const result = await response.json();
    res.json(result);
  } catch (err) {
    console.error('Prediction Error:', err.message);
    res.status(500).json({ msg: "Prediction service currently unavailable" });
  }
};

exports.getFuturePrediction = async (req, res) => {
  try {
    console.log('Future prediction requested for user:', req.user.id);
    
    // Get last 7 days of mood data
    const moods = await Mood.find({ user: req.user.id })
                            .sort({ date: -1 })
                            .limit(7);
                            
    // If not enough history, generate defaults backwards to reach 7 sequence elements
    let history = [];
    if (moods.length > 0) {
      history = moods.reverse().map(m => ({
        sleep_hours: m.sleepHours || 7,
        stress_level: m.anxiety || 5,
        exercise_minutes: m.physicalActivity || 30,
        social_interaction_level: m.socialInteraction || 5,
        screen_time_hours: 4,
        journal_sentiment_score: 0,
        mood_score: m.mood || 5
      }));
    }
    
    // Pad to 7 days if user is new or has fewer logs
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

    const payload = { history: history };

    const response = await fetch('http://127.0.0.1:5006/predict_future', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Flask API error response:", errorText);
        throw new Error('ML Service prediction failed');
    }

    const result = await response.json();
    res.json(result);
  } catch (err) {
    console.error('Future Prediction Error:', err.message);
    res.status(500).json({ msg: "Future prediction service currently unavailable" });
  }
};
