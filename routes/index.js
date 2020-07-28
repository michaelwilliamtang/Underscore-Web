const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../helpers/check-auth')

router.get('/', ensureGuest, (req, res) => {
    res.render('index/welcome');
});

module.exports = router;