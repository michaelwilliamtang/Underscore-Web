const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../helpers/check-auth')
const { getHostname } = require('../helpers/get-hostname');

// load models
require('../models/Post');
require('../models/User');
const Post = mongoose.model('posts');
const User = mongoose.model('users');

// post feed
router.get('/', ensureAuthenticated, (req, res) => {
    Post.find({ $or:[{visib: 'public'}, {user: req.user.id}] })
        .populate('user')
        .sort({ date: 'desc' })
        .then(posts => {
            res.render('posts/feed', {
                posts: posts
            });
        });
});

// single post
router.get('/show/:id', ensureAuthenticated, (req, res) => {
    Post.findOne({
        _id: req.params.id
    })
    .populate('user')
    .populate('comments.commentUser')
    .then(post => {
        if (post.user.id == req.user.id || post.visib == 'public') {
            res.render('posts/show', {
                post: post
            });
        } else {
            res.flash('error_msg', 'Not authorized');
            res.redirect('/posts');
        }
    });
});

// NEW POST
// new post form
router.get('/new', ensureAuthenticated, (req, res) => {
    res.render('posts/new');
});

// process new post
router.post('/', ensureAuthenticated, (req, res) => {
    const newPost = {
        link: req.body.link,
        snippet: req.body.snippet,
        visib: req.body.visib,
        allowComments: req.body.allowComments == 'on',
        user: req.user.id
    }
    console.log(newPost);

    new Post(newPost)
        .save()
        .then(post => {
            req.flash('success_msg', 'Post added');
            res.redirect('/posts')
            // res.redirect(`/posts/show/${post.id}`);
        });
});

// process remote new post
router.post('/remote/new', (req, res) => {
    // console.log(req.body);
    // check valid user id
    User.count({_id: req.body.userid}, (err, count) => {
        if (count == 0) res.send('Invalid userid');
        else {
            const newPost = {
                link: req.body.link,
                snippet: req.body.snippet,
                visib: req.body.visib,
                allowComments: 'on',
                user: req.body.userid
            }
            console.log(newPost);
        
            new Post(newPost)
                .save();
        }
    });
});

// EDIT POST
// edit post form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Post.findOne({
        _id: req.params.id
    })
    .populate('user')
    .then(post => {
        if (post.user.id == req.user.id) {
            res.render('posts/edit', {
                post: post
            });
        } else {
            req.flash('error_msg', 'Not authorized');
            res.redirect('/posts'); // not authorized to edit
        }
    });
});

// process edit post form
router.put('/:id', ensureAuthenticated, (req, res) => {
    Post.findOne({
        _id: req.params.id
    })
    .then(post => { 
        // update vals
        post.link = req.body.link;
        post.snippet = req.body.snippet;
        post.visib = req.body.visib;
        post.allowComments = req.body.allowComments == 'on';

        post.save()
            .then(post => {
                req.flash('success_msg', 'Post updated');
                res.redirect('/posts');
            });
    });
});

// delete post
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Post.findOne({
         _id: req.params.id
    })
    .populate('user')
    .then(post => {
    if (post.user.id === req.user.id) {
        Post.deleteOne({ _id : req.params.id})
            .then(() => {
            req.flash('success_msg', 'Post deleted')
            res.redirect('/my-posts')
    })
    } else {
        req.flash('error_msg', 'Not authorized');
        res.redirect('/my-posts') // not authorized to delete
    }
    });
});

router.post('/comments/:id', ensureAuthenticated, (req, res) => {
    Post.findOne({
        _id: req.params.id
    })
    .then(post => {
        const newComment = {
            commentBody: req.body.commentBody,
            commentUser: req.user.id
        }
        post.comments.unshift(newComment);
        post.save()
        .then(post => {
            req.flash('success_msg', 'Comment added');
            res.redirect(`/posts/show/${post.id}`);
        });
    });
});

module.exports = router;