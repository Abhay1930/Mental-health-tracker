const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const auth = require('../middleware/auth');

router.post('/', auth, journalController.createJournal);

router.get('/', auth, journalController.getJournals);

router.get('/:id', auth, journalController.getJournal);

router.put('/:id', auth, journalController.updateJournal);

router.delete('/:id', auth, journalController.deleteJournal);

router.get('/tag/:tag', auth, journalController.getJournalsByTag);

module.exports = router;
