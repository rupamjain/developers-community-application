const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
//Profile model
const Profile = require('../../models/Profile');

//Post model
const Post = require('../../models/Post');

const validatePostInput = require('../../validation/post');

//@route GET api/posts/test
//@desc Tests posts route
//@access private

router.get('/test', (res, req) => {
	res.json({
		msg: 'posts works'
	});
});

//@route POST api/posts/
//@desc Create Post
//@access private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errs, isValid } = validatePostInput(req.body);

	if (!isValid) {
		return res.status(400).json(errs);
	}
	const newPost = new Post({
		text: req.body.text,
		name: req.body.name,
		avatar: req.body.avatar,
		user: req.user.id
	});

	newPost.save().then((post) => res.json(post)).catch((e) => res.json(e));
});

//@route GET api/posts/
//@desc GET all posts
//@access public
router.get('/', (req, res) => {
	Post.find()
		.sort({ date: -1 })
		.then((posts) => {
			return res.json(posts);
		})
		.catch((e) => res.status(404).json({ nopost: 'No posts found' }));
});

//@route GET api/posts/:id
//@desc GET post by id
//@access public
router.get('/:id', (req, res) => {
	Post.find({ _id: req.params.id })
		.then((posts) => {
			res.json(posts);
		})
		.catch((error) => res.status(404).json({ postnotfound: 'No post found' }));
});

//@route DELETE api/posts/:id
//@desc DELETE post by id
//@access private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id }).then((profile) => {
		Post.findById(req.params.id)
			.then((post) => {
				if (post.user.toString() !== req.user.id) {
					return res.status(401).json({ notAuthorized: 'You are not allowed to delete this post' });
				}
				post.remove().then(() => res.json({ success: true }));
			})
			.catch((e) => res.status(404).json({ postnotfound: 'No post found' }));
	});
});

//@route POST api/posts/like/:id
//@desc Like post by id
//@access private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id }).then((profile) => {
		Post.findById(req.params.id)
			.then((post) => {
				if (post.likes.filter((like) => like.user.toString() === req.user.id).length > 0) {
					return res.status(400).json({ alreadyliked: 'Post already liked' });
				}

				//Add user to like array
				post.likes.unshift({ user: req.user.id });
				post.save().then((post) => res.json(post));
			})
			.catch((e) => res.status(404).json({ postnotfound: 'No post found' }));
	});
});

//@route POST api/posts/unlike/:id
//@desc Unlike post by id
//@access private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id }).then((profile) => {
		Post.findById(req.params.id)
			.then((post) => {
				if (post.likes.filter((like) => like.user.toString() === req.user.id).length === 0) {
					return res.status(400).json({ CannotUnliked: 'Cannot Unliked.You have not liked it yet.' });
				}
				const removeIndex = post.likes.map((like) => like.user.toString()).indexOf(req.user.id);
				//Remove like
				post.likes.splice(removeIndex, 1);
				post.save().then((post) => res.json(post));
			})
			.catch((e) => res.status(404).json({ postnotfound: 'No post found' }));
	});
});

//@route POST api/posts/comment/:id
//@desc  Add comment to post
//@access private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errs, isValid } = validatePostInput(req.body);

	if (!isValid) {
		return res.status(400).json(errs);
	}

	Post.findById(req.params.id)
		.then((post) => {
			const newComment = {
				text: req.body.text,
				avatar: req.body.avatar,
				name: req.body.name,
				user: req.user.id
			};

			post.comments.unshift(newComment);
			post.save().then((posts) => res.json(posts));
		})
		.catch((e) => res.status(404).json({ notfound: 'post not found' }));
});

//@route POST api/posts/comment/:id/:comment_id
//@desc  Remove comment from post
//@access private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Post.findById(req.params.id)
		.then((post) => {
			const comm = post.comments.find((comment) => comment._id.toString() === req.params.comment_id);
			console.log(comm);
			if (!comm) {
				return res.status(404).json({ postnotfound: 'post not found' });
			}
			if (comm.user.toString() === req.user.id) {
				post.comments.pull(comm);
				post.save().then((posts) => res.json(posts));
			}

			//res.json({ found: 'found' });
		})
		.catch((e) => res.status(404).json({ notfound: 'post not found' }));
});
module.exports = router;
