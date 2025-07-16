const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const auth = require('../middleware/auth');

// @route   POST api/journal
// @desc    Create a journal entry
// @access  Private
router.post('/', auth, journalController.createJournal);

// @route   GET api/journal
// @desc    Get all journal entries for a user
// @access  Private
router.get('/', auth, journalController.getJournals);

// @route   GET api/journal/:id
// @desc    Get a single journal entry
// @access  Private
router.get('/:id', auth, journalController.getJournal);

// @route   PUT api/journal/:id
// @desc    Update a journal entry
// @access  Private
router.put('/:id', auth, journalController.updateJournal);

// @route   DELETE api/journal/:id
// @desc    Delete a journal entry
// @access  Private
router.delete('/:id', auth, journalController.deleteJournal);

// @route   GET api/journal/tag/:tag
// @desc    Get journal entries by tag
// @access  Private
router.get('/tag/:tag', auth, journalController.getJournalsByTag);

module.exports = router;
