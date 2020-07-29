const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../helpers/check-auth')

// load models
require('../models/Post');
require('../models/User');
const Post = mongoose.model('posts');
const User = mongoose.model('users');

// post feed
router.get('/', ensureAuthenticated, (req, res) => {
    Post.find({ visib: 'public' })
        // .sort({ date: 'desc' })
        .populate('user')
        .then(posts => {
            res.render('posts/feed', {
                posts: posts
            });
        });
});

// single post
router.get('/show/:id', (req, res) => {
    Post.findOne({
        _id: req.params.id
    })
    .populate('user')
    .then(post => {
        res.render('posts/show', {
            post: post
        });
    });
});

// new post form
router.get('/new', ensureAuthenticated, (req, res) => {
    res.render('posts/new');
});

// process remote post
router.post('/remote/new', (req, res) => {
    // console.log(req.body);
    // check valid user id
    User.count({_id: req.body.userid}, (err, count) => {
        if (count == 0) res.send('Invalid userid');
        else {
            const newPost = {
                link: req.body.link,
                snippet: req.body.snippet,
                visib: 'public',
                allowComments: 'on',
                user: req.body.userid
            }
            console.log(newPost);
        
            new Post(newPost)
                .save();
        }
    })
});

// process form
router.post('/', ensureAuthenticated, (req, res) => {
    let allowComments = req.body.allowComments;

    const newPost = {
        link: req.body.link,
        snippet: req.body.snippet,
        visib: req.body.visib,
        allowComments: allowComments,
        user: req.user.id
    }
    console.log(newPost);

    new Post(newPost)
        .save()
        .then(post => {
            req.flash('success_msg', 'Post added');
            // res.redirect('/posts')
            res.redirect(`/posts/show/${post.id}`);
        });

    // old validation
    // let errors = [];

    // if (!req.body.link) {
    //     errors.push({ text: 'Please add a link' });
    // }
    // if (!req.body.snippet) {
    //     errors.push({ text: 'Please add snippet' });
    // }

    // if (errors.length > 0) {
    //     res.render('posts/new', {
    //         errors: errors,
    //         title: req.body.title,
    //         details: req.body.details
    //     });
    // } else {
    //     const newPost = {
    //         link: req.body.link,
    //         snippet: req.body.snippet,
    //         user: req.user.googleId
    //     }
    //     new Post(newPost)
    //         .save()
    //         .then(post => {
    //             req.flash('success_msg', 'Snippet posted');
    //             res.redirect('/posts');
    //         });
    // }
});

module.exports = router;