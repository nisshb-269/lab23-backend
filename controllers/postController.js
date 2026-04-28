const Post = require('../models/Post')

// POST /api/posts — Create a post (protected)
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body
    if (!title || !content)
      return res.status(400).json({ message: 'Title and content are required' })

    const post = new Post({
      title,
      content,
      author: req.user.id
    })

    await post.save()
    await post.populate('author', 'name email')

    res.status(201).json(post)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// GET /api/posts — Get all posts with author name populated
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 })

    res.json(posts)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// PUT /api/posts/:id — Update own post only (protected)
exports.updatePost = async (req, res) => {
  try {
    const { title, content } = req.body
    if (!title || !content)
      return res.status(400).json({ message: 'Title and content are required' })

    const post = await Post.findById(req.params.id)
    if (!post)
      return res.status(404).json({ message: 'Post not found' })

    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to update this post' })

    post.title = title
    post.content = content
    await post.save()
    await post.populate('author', 'name')

    res.json(post)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// DELETE /api/posts/:id — Delete own post only (protected)
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post)
      return res.status(404).json({ message: 'Post not found' })

    // Security check — only the author can delete
    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to delete this post' })

    await post.deleteOne()
    res.json({ message: 'Post deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}
