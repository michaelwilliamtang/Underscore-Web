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
    Post.find({ visib: 'public' })
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

// process form
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

// edit form
router.put('/:id', ensureAuthenticated, (req, res) => {
    Post.findOne({
        _id: req.params.id
    })
    .then(post => {
        let allowComments = req.body.allowComments;
        
        // update vals
        post.link = req.body.link;
        post.snippet = req.body.snippet;
        post.visib = req.body.visib;
        post.allowComments = req.body.allowComments;

        post.save()
            .then(post => {
                req.flash('success_msg', 'Post updated');
                res.redirect('/posts');
            });
    });
});

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
      })
  });

module.exports = router;