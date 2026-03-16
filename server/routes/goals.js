const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const auth = require('../middleware/auth');

router.post('/', auth, goalController.createGoal);

router.get('/', auth, goalController.getGoals);

router.get('/:id', auth, goalController.getGoal);

router.put('/:id', auth, goalController.updateGoal);

router.delete('/:id', auth, goalController.deleteGoal);

router.put('/:id/step', auth, goalController.updateStep);

router.get('/category/:category', auth, goalController.getGoalsByCategory);

module.exports = router;
