const mongoose = require('mongoose');

const LiveClassSchema = new mongoose.Schema({
    title: { type: String, required: true },
    videoId: { type: String, required: true }, // YouTube video ID
    description: { type: String },
    thumbnail: { type: String },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin ID
    allowedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who can access this video
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LiveClass', LiveClassSchema);