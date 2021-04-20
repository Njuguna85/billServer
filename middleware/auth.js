const ensureAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/auth/google')
    }
}

const ensureAuthLocal = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/login')
    }
}

module.exports.ensureAuth = ensureAuth
module.exports.ensureAuthLocal = ensureAuthLocal
