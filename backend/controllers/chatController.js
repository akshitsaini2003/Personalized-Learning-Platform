const Chat = require('../models/Chat');
const User = require('../models/User');

exports.sendMessage = async (req, res) => {
  const { message, receiverId, isToEveryone, isToAdmins } = req.body;
  const senderId = req.user.id;

  if (!message || message.trim() === '') {
    return res.status(400).json({ message: 'Message cannot be empty' });
  }

  if (!isToEveryone && !isToAdmins && !receiverId) {
    return res.status(400).json({ message: 'Please select a recipient or choose "To Everyone" or "To Admins"' });
  }

  try {
    // Create an array for receivers
    const receivers = [];
    if (receiverId) {
      receivers.push(receiverId); // Add selected receiver
    }
    receivers.push(senderId); // Add sender to receivers

    const chat = new Chat({
      sender: senderId,
      receiver: receivers, // Set receiver as an array
      message,
      isToEveryone,
      isToAdmins,
    });

    await chat.save();
    res.status(201).json({ message: 'Message sent successfully', chat });
  } catch (err) {
    res.status(500).json({ message: 'Error sending message', error: err.message });
  }
};

// exports.getMessages = async (req, res) => {
//   const userId = req.user.id;

//   try {
//     const user = await User.findById(userId);
//     let messages;

//     if (user.role === 'admin') {
//       messages = await Chat.find({
//         $or: [
//           { isToEveryone: true },
//           { isToAdmins: true },
//           { receiver: userId }, // Check if userId is in receiver array
//         ],
//       }).populate('sender', 'name');
//     } else {
//       messages = await Chat.find({
//         $or: [
//           { isToEveryone: true },
//           { receiver: userId }, // Check if userId is in receiver array
//         ],
//       }).populate('sender', 'name');
//     }

//     res.status(200).json(messages);
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching messages', error: err.message });
//   }
// };

exports.getMessages = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    let messages;

    if (user.role === 'admin') {
      messages = await Chat.find({
        $or: [
          { isToEveryone: true },
          { isToAdmins: true },
          { receiver: userId },
        ],
      }).populate('sender', 'name role'); // Include 'role' in populate
    } else {
      messages = await Chat.find({
        $or: [
          { isToEveryone: true },
          { receiver: userId },
        ],
      }).populate('sender', 'name role'); // Include 'role' in populate
    }

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages', error: err.message });
  }
};

exports.deleteMessage = async (req, res) => {
  const { messageId } = req.params;

  try {
    const deletedMessage = await Chat.findByIdAndDelete(messageId);
    if (!deletedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting message', error: err.message });
  }
};