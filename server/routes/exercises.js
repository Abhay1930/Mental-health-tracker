const express = require('express');
const router = express.Router();
const exercisesController = require('../controllers/exercisesController');
const auth = require('../middleware/auth');

router.get('/', auth, exercisesController.getExercises);

router.get('/category/:category', auth, exercisesController.getExercisesByCategory);

router.get('/:id', auth, exercisesController.getExercise);

router.post('/', auth, exercisesController.createExercise);

module.exports = router;
