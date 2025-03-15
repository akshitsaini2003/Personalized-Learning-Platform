const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Thread', threadSchema);