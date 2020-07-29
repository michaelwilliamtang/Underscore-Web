module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) return next();
        req.flash('error_msg', 'Not authorized');
        res.redirect('/');
    },
    ensureGuest: (req, res, next) => {
        if (req.isAuthenticated()) res.redirect('/posts');
        else return next();
    }
}