module.exports = {
    isAdmin: (req, res, next) => {
        // console.log(req.user.role)
        if(req.isAuthenticated() && req.user.role == 'admin'){
            return next()
        }

        req.flash('error_msg', 'This is an Admin only page. You were redirected to the Homepage.')
        res.redirect('/')
    },
}