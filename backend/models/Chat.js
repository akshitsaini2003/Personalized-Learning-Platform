const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Updated to array
  message: { type: String, required: true },
  isToEveryone: { type: Boolean, default: false },
  isToAdmins: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Chat', chatSchema);