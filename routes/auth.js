const express = require('express');
const router = express.Router();
const passport = require('passport');

// get auth info
router.get('/google', passport.authenticate('google',
    { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
        req.flash('success_msg', 'Logged in');
        res.redirect('/posts')
    });

// verification util
// router.get('/verify', (req, res) => {
//     if (req.user) {
//         console.log(req.user);
//     } else {
//         console.log('Not Authorized');
//     }
// });

// logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Logged out');
    res.redirect('/');
})

module.exports = router;
