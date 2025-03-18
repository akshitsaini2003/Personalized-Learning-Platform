// controllers/threadController.js
const Thread = require('../models/Thread');
const Reply = require('../models/Reply');

// Create a new thread
exports.createThread = async (req, res) => {
  const { title, content } = req.body;
  const author = req.user.id;

  try {
    const thread = new Thread({ title, content, author });
    await thread.save();
    res.status(201).json(thread);
  } catch (err) {
    res.status(500).json({ message: 'Error creating thread', error: err.message });
  }
};

// Get all threads
exports.getThreads = async (req, res) => {
  try {
    const threads = await Thread.find().populate('author', 'name').populate({
      path: 'replies',
      populate: { path: 'author', select: 'name' },
    });
    res.status(200).json(threads);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching threads', error: err.message });
  }
};

// Edit a thread (restricted to admins)
exports.editThread = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
  
    // Check if the user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
  
    try {
      const updatedThread = await Thread.findByIdAndUpdate(
        id,
        { title, content },
        { new: true }
      );
      if (!updatedThread) {
        return res.status(404).json({ message: 'Thread not found' });
      }
      res.status(200).json({ message: 'Thread updated successfully', thread: updatedThread });
    } catch (err) {
      res.status(500).json({ message: 'Error updating thread', error: err.message });
    }
  };

// Delete a thread (restricted to admins)
exports.deleteThread = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Delete the thread
      const deletedThread = await Thread.findByIdAndDelete(id);
      if (!deletedThread) {
        return res.status(404).json({ message: 'Thread not found' });
      }
  
      // Delete all replies associated with this thread
      await Reply.deleteMany({ thread: id });
  
      res.status(200).json({ message: 'Thread and its replies deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting thread', error: err.message });
    }
  };

// Like a thread
exports.likeThread = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const thread = await Thread.findById(id);
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    // Check if the user already liked the thread
    if (thread.likes.includes(userId)) {
      return res.status(400).json({ message: 'You already liked this thread' });
    }

    thread.likes.push(userId);
    await thread.save();

    res.status(200).json({ message: 'Thread liked successfully', thread });
  } catch (err) {
    res.status(500).json({ message: 'Error liking thread', error: err.message });
  }
};