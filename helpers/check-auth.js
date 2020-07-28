module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) return next();
        req.flash('error_msg', 'Not authorized');
        res.redirect('/');
    },
    ensureGuest: function(req, res, next) {
        if (req.isAuthenticated()) res.redirect('/posts');
        else return next();
    }
}