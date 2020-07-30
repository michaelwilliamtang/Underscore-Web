const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../helpers/check-auth');
const clipboardy = require('clipboardy');

router.get('/', ensureAuthenticated, (req, res) => {
    res.render('account/info');
});

// copy to clipboard
router.post('/copy-id', ensureAuthenticated, (req, res) => {
    // console.log(req.user.id)
    clipboardy.writeSync(req.user.id);
    req.flash('success_msg', 'User ID Copied');
    res.redirect('/account');
});

module.exports = router;