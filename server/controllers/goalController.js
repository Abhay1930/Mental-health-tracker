const Goal = require('../models/Goal');

// Create a new goal
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

// Get all goals for a user
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get a single goal
exports.getGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    
    // Check if goal exists
    if (!goal) {
      return res.status(404).json({ msg: 'Goal not found' });
    }
    
    // Check user
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

// Update a goal
exports.updateGoal = async (req, res) => {
  try {
    const { title, description, category, steps, targetDate, isCompleted, progress } = req.body;
    
    // Build goal object
    const goalFields = {};
    if (title !== undefined) goalFields.title = title;
    if (description !== undefined) goalFields.description = description;
    if (category !== undefined) goalFields.category = category;
    if (steps !== undefined) goalFields.steps = steps;
    if (targetDate !== undefined) goalFields.targetDate = targetDate;
    if (progress !== undefined) goalFields.progress = progress;
    
    // Handle completion status
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
    
    // Check if goal exists
    if (!goal) {
      return res.status(404).json({ msg: 'Goal not found' });
    }
    
    // Check user
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Update
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

// Delete a goal
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    
    // Check if goal exists
    if (!goal) {
      return res.status(404).json({ msg: 'Goal not found' });
    }
    
    // Check user
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

// Update a step in a goal
exports.updateStep = async (req, res) => {
  try {
    const { stepId, isCompleted } = req.body;
    
    const goal = await Goal.findById(req.params.id);
    
    // Check if goal exists
    if (!goal) {
      return res.status(404).json({ msg: 'Goal not found' });
    }
    
    // Check user
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Find the step
    const stepIndex = goal.steps.findIndex(step => step._id.toString() === stepId);
    
    if (stepIndex === -1) {
      return res.status(404).json({ msg: 'Step not found' });
    }
    
    // Update the step
    goal.steps[stepIndex].isCompleted = isCompleted;
    
    if (isCompleted) {
      goal.steps[stepIndex].completedAt = Date.now();
    } else {
      goal.steps[stepIndex].completedAt = null;
    }
    
    // Calculate progress
    const completedSteps = goal.steps.filter(step => step.isCompleted).length;
    goal.progress = goal.steps.length > 0 ? Math.round((completedSteps / goal.steps.length) * 100) : 0;
    
    // Check if all steps are completed
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

// Get goals by category
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
