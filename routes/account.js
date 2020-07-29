const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../helpers/check-auth')

router.get('/', ensureAuthenticated, (req, res) => {
    res.render('account/info');
});

module.exports = router;