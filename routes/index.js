const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../helpers/check-auth')

// load models
require('../models/Post');
const Post = mongoose.model('posts');

router.get('/', ensureGuest, (req, res) => {
    res.render('index/welcome', {layout: 'splash.handlebars'});
});

router.get('/my-posts', ensureAuthenticated, (req, res) => {
    Post.find({user: req.user.id})
    .sort({ date: 'desc' })
    .then(posts => {
        res.render('index/my-posts', {
            posts: posts
        });
    });
});

module.exports = router;