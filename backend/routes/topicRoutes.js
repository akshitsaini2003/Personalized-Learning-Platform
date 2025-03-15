const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');

// ✅ Add Topic
router.post('/add-topic', async (req, res) => {
  const { title, description } = req.body;
  try {
    const topic = new Topic({ title, description });
    await topic.save();
    res.status(201).json({ message: 'Topic added successfully!', topic });
  } catch (err) {
    res.status(500).json({ message: 'Error adding topic', error: err.message });
  }
});

// ✅ Get All Topics
router.get('/topics', async (req, res) => {
  try {
    const topics = await Topic.find();
    res.json(topics);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching topics', error: err.message });
  }
});

// ✅ Edit Topic
router.put('/edit-topic/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const updatedTopic = await Topic.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );
    if (!updatedTopic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.json({ message: 'Topic updated successfully!', topic: updatedTopic });
  } catch (err) {
    res.status(500).json({ message: 'Error updating topic', error: err.message });
  }
});

// ✅ Delete Topic
router.delete('/delete-topic/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTopic = await Topic.findByIdAndDelete(id);
    if (!deletedTopic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.json({ message: 'Topic deleted successfully!', topic: deletedTopic });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting topic', error: err.message });
  }
});

module.exports = router;