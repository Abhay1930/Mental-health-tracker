const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');

router.post('/', auth, postController.createPost);

router.get('/', auth, postController.getPosts);

router.get('/tag/:tag', auth, postController.getPostsByTag);

router.get('/user/:userId', auth, postController.getPostsByUser);

router.get('/:id', auth, postController.getPost);

router.put('/:id', auth, postController.updatePost);

router.delete('/:id', auth, postController.deletePost);

router.put('/like/:id', auth, postController.likePost);

router.post('/comment/:id', auth, postController.addComment);

router.delete('/comment/:id/:comment_id', auth, postController.deleteComment);

router.put('/report/:id', auth, postController.reportPost);

router.put('/report-comment/:id/:comment_id', auth, postController.reportComment);

router.get('/reported', auth, postController.getReportedPosts);

router.put('/moderate/:id', auth, postController.moderatePost);

module.exports = router;
