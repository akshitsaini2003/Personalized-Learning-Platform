// controllers/replyController.js
const Reply = require('../models/Reply');
const Thread = require('../models/Thread');

exports.createReply = async (req, res) => {
  const { content, threadId } = req.body;
  const author = req.user.id;

  try {
    const reply = new Reply({ content, author, thread: threadId });
    await reply.save();

    // Add the reply to the thread
    const thread = await Thread.findById(threadId);
    thread.replies.push(reply._id);
    await thread.save();

    res.status(201).json(reply);
  } catch (err) {
    res.status(500).json({ message: 'Error creating reply', error: err.message });
  }
};

// Get all replies
exports.getReplies = async (req, res) => {
  try {
    const replies = await Reply.find().populate('author', 'name');
    res.status(200).json(replies);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching replies', error: err.message });
  }
};

// Edit a reply (restricted to admins)
exports.editReply = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
  
    // Check if the user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
  
    try {
      const updatedReply = await Reply.findByIdAndUpdate(
        id,
        { content },
        { new: true }
      );
      if (!updatedReply) {
        return res.status(404).json({ message: 'Reply not found' });
      }
      res.status(200).json({ message: 'Reply updated successfully', reply: updatedReply });
    } catch (err) {
      res.status(500).json({ message: 'Error updating reply', error: err.message });
    }
  };

// Delete a reply (restricted to admins)
exports.deleteReply = async (req, res) => {
  const { id } = req.params;

  // Check if the user is an admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }

  try {
    const deletedReply = await Reply.findByIdAndDelete(id);
    if (!deletedReply) {
      return res.status(404).json({ message: 'Reply not found' });
    }
    res.status(200).json({ message: 'Reply deleted successfully', reply: deletedReply });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting reply', error: err.message });
  }
};