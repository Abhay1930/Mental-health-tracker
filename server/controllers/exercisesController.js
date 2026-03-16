const Exercise = require('../models/Exercise');

exports.getExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find().sort({ createdAt: -1 });
    res.json(exercises);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getExercisesByCategory = async (req, res) => {
  try {
    const exercises = await Exercise.find({ category: req.params.category }).sort({ createdAt: -1 });
    res.json(exercises);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    
    if (!exercise) {
      return res.status(404).json({ msg: 'Exercise not found' });
    }
    
    res.json(exercise);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Exercise not found' });
    }
    res.status(500).send('Server error');
  }
};

exports.createExercise = async (req, res) => {
  try {
    const { title, description, category, duration, steps, benefits } = req.body;
    
    const newExercise = new Exercise({
      title,
      description,
      category,
      duration,
      steps,
      benefits
    });
    
    const exercise = await newExercise.save();
    res.json(exercise);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
