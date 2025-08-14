const express = require('express');
const Content = require('../models/Content');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all content
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, type, category, search } = req.query;
    
    let query = { isPublished: true };
    
    if (type) query.type = type;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const content = await Content.find(query)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Content.countDocuments(query);

    res.json({
      content,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single content
router.get('/:id', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id)
      .populate('author', 'name avatar');

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Increment views
    content.stats.views += 1;
    await content.save();

    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create content (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const content = new Content({
      ...req.body,
      author: req.user.userId
    });

    await content.save();
    await content.populate('author', 'name avatar');

    res.status(201).json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update content
router.put('/:id', auth, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Check if user is the author or admin
    if (content.author.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(content, req.body);
    await content.save();
    await content.populate('author', 'name avatar');

    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Like/unlike content
router.post('/:id/like', auth, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    const userIndex = content.stats.likes.indexOf(req.user.userId);
    
    if (userIndex > -1) {
      content.stats.likes.splice(userIndex, 1);
    } else {
      content.stats.likes.push(req.user.userId);
    }

    await content.save();
    res.json({ likes: content.stats.likes.length, liked: userIndex === -1 });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
