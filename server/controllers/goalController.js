const Goal = require('../models/Goal');

exports.createGoal = async (req, res) => {
  try {
    const { title, description, category, steps, targetDate } = req.body;
    
    const newGoal = new Goal({
      user: req.user.id,
      title,
      description,
      category,
      steps: steps || [],
      targetDate,
      progress: 0,
      isCompleted: false
    });
    
    const goal = await newGoal.save();
    res.json(goal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ msg: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    res.json(goal);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Goal not found' });
    }
    res.status(500).send('Server error');
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const { title, description, category, steps, targetDate, isCompleted, progress } = req.body;

    const goalFields = {};
    if (title !== undefined) goalFields.title = title;
    if (description !== undefined) goalFields.description = description;
    if (category !== undefined) goalFields.category = category;
    if (steps !== undefined) goalFields.steps = steps;
    if (targetDate !== undefined) goalFields.targetDate = targetDate;
    if (progress !== undefined) goalFields.progress = progress;

    if (isCompleted !== undefined) {
      goalFields.isCompleted = isCompleted;
      if (isCompleted) {
        goalFields.completedAt = Date.now();
        goalFields.progress = 100;
      } else {
        goalFields.completedAt = null;
      }
    }
    
    goalFields.updatedAt = Date.now();
    
    let goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ msg: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    goal = await Goal.findByIdAndUpdate(
      req.params.id,
      { $set: goalFields },
      { new: true }
    );
    
    res.json(goal);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Goal not found' });
    }
    res.status(500).send('Server error');
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ msg: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    await goal.deleteOne();
    
    res.json({ msg: 'Goal removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Goal not found' });
    }
    res.status(500).send('Server error');
  }
};

exports.updateStep = async (req, res) => {
  try {
    const { stepId, isCompleted } = req.body;
    
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ msg: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const stepIndex = goal.steps.findIndex(step => step._id.toString() === stepId);
    
    if (stepIndex === -1) {
      return res.status(404).json({ msg: 'Step not found' });
    }

    goal.steps[stepIndex].isCompleted = isCompleted;
    
    if (isCompleted) {
      goal.steps[stepIndex].completedAt = Date.now();
    } else {
      goal.steps[stepIndex].completedAt = null;
    }

    const completedSteps = goal.steps.filter(step => step.isCompleted).length;
    goal.progress = goal.steps.length > 0 ? Math.round((completedSteps / goal.steps.length) * 100) : 0;

    if (goal.progress === 100 && !goal.isCompleted) {
      goal.isCompleted = true;
      goal.completedAt = Date.now();
    } else if (goal.progress < 100 && goal.isCompleted) {
      goal.isCompleted = false;
      goal.completedAt = null;
    }
    
    goal.updatedAt = Date.now();
    
    await goal.save();
    
    res.json(goal);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Goal not found' });
    }
    res.status(500).send('Server error');
  }
};

exports.getGoalsByCategory = async (req, res) => {
  try {
    const goals = await Goal.find({ 
      user: req.user.id,
      category: req.params.category
    }).sort({ createdAt: -1 });
    
    res.json(goals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
