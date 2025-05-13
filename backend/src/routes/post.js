// backend/routes/posts.js
const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const { authenticate } = require('../middleware/authMiddleware');

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    const { type, content, imageUrl } = req.body;

    const newPost = new Post({
      userId: req.user.id,
      type,
      content,
      imageUrl,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
