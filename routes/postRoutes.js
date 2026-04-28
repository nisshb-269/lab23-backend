const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')
const { createPost, getAllPosts, deletePost, updatePost } = require('../controllers/postController')

router.post('/',      authMiddleware, createPost)
router.get('/',       authMiddleware, getAllPosts)
router.put('/:id',    authMiddleware, updatePost)
router.delete('/:id', authMiddleware, deletePost)

module.exports = router
