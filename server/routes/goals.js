const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const auth = require('../middleware/auth');

// @route   POST api/goals
// @desc    Create a goal
// @access  Private
router.post('/', auth, goalController.createGoal);

// @route   GET api/goals
// @desc    Get all goals for a user
// @access  Private
router.get('/', auth, goalController.getGoals);

// @route   GET api/goals/:id
// @desc    Get a single goal
// @access  Private
router.get('/:id', auth, goalController.getGoal);

// @route   PUT api/goals/:id
// @desc    Update a goal
// @access  Private
router.put('/:id', auth, goalController.updateGoal);

// @route   DELETE api/goals/:id
// @desc    Delete a goal
// @access  Private
router.delete('/:id', auth, goalController.deleteGoal);

// @route   PUT api/goals/:id/step
// @desc    Update a step in a goal
// @access  Private
router.put('/:id/step', auth, goalController.updateStep);

// @route   GET api/goals/category/:category
// @desc    Get goals by category
// @access  Private
router.get('/category/:category', auth, goalController.getGoalsByCategory);

module.exports = router;
