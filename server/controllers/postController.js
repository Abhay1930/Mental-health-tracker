const Post = require('../models/Post');
const User = require('../models/User');

exports.createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    const newPost = new Post({
      user: req.user.id,
      title,
      content,
      tags: tags || []
    });
    
    const post = await newPost.save();

    const populatedPost = await Post.findById(post._id)
      .populate('user', ['firstName', 'lastName', 'username'])
      .populate('comments.user', ['firstName', 'lastName', 'username']);
    
    res.json(populatedPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .populate('user', ['firstName', 'lastName', 'username'])
      .populate('comments.user', ['firstName', 'lastName', 'username']);
    
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getPostsByTag = async (req, res) => {
  try {
    const posts = await Post.find({ 
      tags: { $in: [req.params.tag] },
      isApproved: true
    })
      .sort({ createdAt: -1 })
      .populate('user', ['firstName', 'lastName', 'username'])
      .populate('comments.user', ['firstName', 'lastName', 'username']);
    
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ 
      user: req.params.userId,
      isApproved: true
    })
      .sort({ createdAt: -1 })
      .populate('user', ['firstName', 'lastName', 'username'])
      .populate('comments.user', ['firstName', 'lastName', 'username']);
    
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', ['firstName', 'lastName', 'username'])
      .populate('comments.user', ['firstName', 'lastName', 'username']);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (!post.isApproved && post.user._id.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'This post is under review' });
    }
    
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const postFields = {};
    if (title !== undefined) postFields.title = title;
    if (content !== undefined) postFields.content = content;
    if (tags !== undefined) postFields.tags = tags;
    postFields.updatedAt = Date.now();
    
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    post = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: postFields },
      { new: true }
    ).populate('user', ['firstName', 'lastName', 'username'])
     .populate('comments.user', ['firstName', 'lastName', 'username']);
    
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    await post.deleteOne();
    
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (post.likes.some(like => like.toString() === req.user.id)) {

      post.likes = post.likes.filter(like => like.toString() !== req.user.id);
    } else {

      post.likes.unshift(req.user.id);
    }
    
    await post.save();
    
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
};

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const user = await User.findById(req.user.id).select('-password');
    
    const newComment = {
      user: req.user.id,
      text,
      name: `${user.firstName} ${user.lastName}`
    };
    
    post.comments.unshift(newComment);
    
    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('user', ['firstName', 'lastName', 'username'])
      .populate('comments.user', ['firstName', 'lastName', 'username']);
    
    res.json(populatedPost.comments);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const comment = post.comments.find(comment => comment._id.toString() === req.params.comment_id);

    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user.id && post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    post.comments = post.comments.filter(comment => comment._id.toString() !== req.params.comment_id);
    
    await post.save();
    
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post or comment not found' });
    }
    res.status(500).send('Server error');
  }
};

exports.reportPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    post.isReported = true;
    
    await post.save();
    
    res.json({ msg: 'Post reported successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
};

exports.reportComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const comment = post.comments.find(comment => comment._id.toString() === req.params.comment_id);

    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    
    comment.isReported = true;
    
    await post.save();
    
    res.json({ msg: 'Comment reported successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post or comment not found' });
    }
    res.status(500).send('Server error');
  }
};

exports.getReportedPosts = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);
    if (!user.isAdmin) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    const posts = await Post.find({ isReported: true })
      .sort({ createdAt: -1 })
      .populate('user', ['firstName', 'lastName', 'username'])
      .populate('comments.user', ['firstName', 'lastName', 'username']);
    
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.moderatePost = async (req, res) => {
  try {
    const { isApproved } = req.body;

    const user = await User.findById(req.user.id);
    if (!user.isAdmin) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    post.isApproved = isApproved;
    post.isReported = false; // Clear the report flag
    
    await post.save();
    
    res.json({ msg: isApproved ? 'Post approved' : 'Post rejected' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
};
