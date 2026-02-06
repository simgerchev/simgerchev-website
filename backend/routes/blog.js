import express from 'express';
import { body, validationResult } from 'express-validator';
import BlogPost from '../models/BlogPost.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all published blog posts (public)
router.get('/posts', async (req, res) => {
  try {
    const posts = await BlogPost.find({ published: true })
      .populate('author', 'email')
      .sort({ publishedAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single post by slug (public)
router.get('/posts/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ 
      slug: req.params.slug, 
      published: true 
    }).populate('author', 'email');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all posts including unpublished (admin only)
router.get('/admin/posts', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const posts = await BlogPost.find()
      .populate('author', 'email')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new blog post (admin only)
router.post('/posts', [
  authMiddleware,
  adminMiddleware,
  body('title').notEmpty().trim(),
  body('content').notEmpty(),
  body('slug').notEmpty().trim().toLowerCase()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, excerpt, slug, tags, coverImage, published } = req.body;

    // Check if slug already exists
    const existingPost = await BlogPost.findOne({ slug });
    if (existingPost) {
      return res.status(400).json({ message: 'Slug already exists' });
    }

    const post = new BlogPost({
      title,
      content,
      excerpt,
      slug,
      tags: tags || [],
      coverImage,
      published: published || false,
      author: req.user.userId
    });

    await post.save();
    await post.populate('author', 'email');

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update blog post (admin only)
router.put('/posts/:id', [
  authMiddleware,
  adminMiddleware,
  body('title').optional().notEmpty().trim(),
  body('content').optional().notEmpty(),
  body('slug').optional().notEmpty().trim().toLowerCase()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, excerpt, slug, tags, coverImage, published } = req.body;

    // If slug is being changed, check if it already exists
    if (slug) {
      const existingPost = await BlogPost.findOne({ 
        slug, 
        _id: { $ne: req.params.id } 
      });
      if (existingPost) {
        return res.status(400).json({ message: 'Slug already exists' });
      }
    }

    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { title, content, excerpt, slug, tags, coverImage, published },
      { new: true, runValidators: true }
    ).populate('author', 'email');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete blog post (admin only)
router.delete('/posts/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
