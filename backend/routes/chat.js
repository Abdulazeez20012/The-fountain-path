const express = require('express');
const Chat = require('../models/Chat');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all chats for user
router.get('/', auth, async (req, res) => {
  try {
    const chats = await Chat.find({
      'participants.user': req.user.userId
    })
    .populate('participants.user', 'name avatar')
    .populate('messages.sender', 'name avatar')
    .sort({ lastActivity: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single chat
router.get('/:id', auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate('participants.user', 'name avatar')
      .populate('messages.sender', 'name avatar');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(
      p => p.user._id.toString() === req.user.userId
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create group chat
router.post('/group', auth, async (req, res) => {
  try {
    const { name, isPrivate = false } = req.body;

    const chat = new Chat({
      name,
      type: 'group',
      participants: [{
        user: req.user.userId,
        role: 'admin'
      }],
      settings: { isPrivate }
    });

    await chat.save();
    await chat.populate('participants.user', 'name avatar');

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send message
router.post('/:id/messages', auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(
      p => p.user.toString() === req.user.userId
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const message = {
      sender: req.user.userId,
      content: req.body.content,
      type: req.body.type || 'text'
    };

    if (req.body.media) {
      message.media = req.body.media;
    }

    chat.messages.push(message);
    chat.lastActivity = new Date();
    await chat.save();

    await chat.populate('messages.sender', 'name avatar');

    res.status(201).json(chat.messages[chat.messages.length - 1]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Founder chat (special route)
router.get('/founder/special', auth, async (req, res) => {
  try {
    let chat = await Chat.findOne({ type: 'founder' })
      .populate('participants.user', 'name avatar')
      .populate('messages.sender', 'name avatar');

    if (!chat) {
      chat = new Chat({
        name: 'Messages to Aafaakallah',
        type: 'founder',
        participants: []
      });
      await chat.save();
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
