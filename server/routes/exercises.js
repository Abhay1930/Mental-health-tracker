const express = require('express');
const router = express.Router();
const exercisesController = require('../controllers/exercisesController');
const auth = require('../middleware/auth');

// @route   GET api/exercises
// @desc    Get all exercises
// @access  Private
router.get('/', auth, exercisesController.getExercises);

// @route   GET api/exercises/category/:category
// @desc    Get exercises by category
// @access  Private
router.get('/category/:category', auth, exercisesController.getExercisesByCategory);

// @route   GET api/exercises/:id
// @desc    Get a single exercise
// @access  Private
router.get('/:id', auth, exercisesController.getExercise);

// @route   POST api/exercises
// @desc    Create a new exercise (admin only)
// @access  Private/Admin
router.post('/', auth, exercisesController.createExercise);

module.exports = router;
