const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post('/', auth, postController.createPost);

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, postController.getPosts);

// @route   GET api/posts/tag/:tag
// @desc    Get posts by tag
// @access  Private
router.get('/tag/:tag', auth, postController.getPostsByTag);

// @route   GET api/posts/user/:userId
// @desc    Get posts by user
// @access  Private
router.get('/user/:userId', auth, postController.getPostsByUser);

// @route   GET api/posts/:id
// @desc    Get a single post
// @access  Private
router.get('/:id', auth, postController.getPost);

// @route   PUT api/posts/:id
// @desc    Update a post
// @access  Private
router.put('/:id', auth, postController.updatePost);

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, postController.deletePost);

// @route   PUT api/posts/like/:id
// @desc    Like or unlike a post
// @access  Private
router.put('/like/:id', auth, postController.likePost);

// @route   POST api/posts/comment/:id
// @desc    Add a comment to a post
// @access  Private
router.post('/comment/:id', auth, postController.addComment);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete a comment from a post
// @access  Private
router.delete('/comment/:id/:comment_id', auth, postController.deleteComment);

// @route   PUT api/posts/report/:id
// @desc    Report a post
// @access  Private
router.put('/report/:id', auth, postController.reportPost);

// @route   PUT api/posts/report-comment/:id/:comment_id
// @desc    Report a comment
// @access  Private
router.put('/report-comment/:id/:comment_id', auth, postController.reportComment);

// @route   GET api/posts/reported
// @desc    Get all reported posts
// @access  Private (Admin only)
router.get('/reported', auth, postController.getReportedPosts);

// @route   PUT api/posts/moderate/:id
// @desc    Approve or reject a post
// @access  Private (Admin only)
router.put('/moderate/:id', auth, postController.moderatePost);

module.exports = router;
