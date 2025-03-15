const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  topicId: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId(), unique: true }
});
const Topic = mongoose.model('Topic', topicSchema);
module.exports = Topic;
