const Journal = require('../models/Journal');

// Create a new journal entry
exports.createJournal = async (req, res) => {
  try {
    const { title, content, tags, mood, isPrivate } = req.body;
    
    const newJournal = new Journal({
      user: req.user.id,
      title,
      content,
      tags,
      mood,
      isPrivate
    });
    
    const journal = await newJournal.save();
    res.json(journal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all journal entries for a user
exports.getJournals = async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(journals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get a single journal entry
exports.getJournal = async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);
    
    // Check if journal exists
    if (!journal) {
      return res.status(404).json({ msg: 'Journal entry not found' });
    }
    
    // Check user
    if (journal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    res.json(journal);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Journal entry not found' });
    }
    res.status(500).send('Server error');
  }
};

// Update a journal entry
exports.updateJournal = async (req, res) => {
  try {
    const { title, content, tags, mood, isPrivate } = req.body;
    
    // Build journal object
    const journalFields = {};
    if (title !== undefined) journalFields.title = title;
    if (content !== undefined) journalFields.content = content;
    if (tags !== undefined) journalFields.tags = tags;
    if (mood !== undefined) journalFields.mood = mood;
    if (isPrivate !== undefined) journalFields.isPrivate = isPrivate;
    journalFields.updatedAt = Date.now();
    
    let journal = await Journal.findById(req.params.id);
    
    // Check if journal exists
    if (!journal) {
      return res.status(404).json({ msg: 'Journal entry not found' });
    }
    
    // Check user
    if (journal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Update
    journal = await Journal.findByIdAndUpdate(
      req.params.id,
      { $set: journalFields },
      { new: true }
    );
    
    res.json(journal);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Journal entry not found' });
    }
    res.status(500).send('Server error');
  }
};

// Delete a journal entry
exports.deleteJournal = async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);
    
    // Check if journal exists
    if (!journal) {
      return res.status(404).json({ msg: 'Journal entry not found' });
    }
    
    // Check user
    if (journal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    await journal.deleteOne();
    
    res.json({ msg: 'Journal entry removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Journal entry not found' });
    }
    res.status(500).send('Server error');
  }
};

// Get journal entries by tag
exports.getJournalsByTag = async (req, res) => {
  try {
    const journals = await Journal.find({ 
      user: req.user.id,
      tags: { $in: [req.params.tag] }
    }).sort({ createdAt: -1 });
    
    res.json(journals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
