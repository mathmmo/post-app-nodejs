const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const passport = require('passport')

router.get('/register', (req,res) => {
    res.render('user/register')
})

router.post('/register', (req,res) => {
    var errors = []
    const {name, email, password, password2} = req.body
    if(name.length < 2 || !name || name === undefined || name === null){
        errors.push({
            status: 422,
            message: 'Mandatory "Name" field is empty or is not valid.'
        })
    }
    if(email.length < 2 || !email || email === undefined || email === null){
        errors.push({
            status: 422,
            message: 'Mandatory "E-mail" field is empty or is not valid.'
        })
    }
    if(password.length < 4 || !password || password === undefined || password === null){
        errors.push({
            status: 422,
            message: 'Mandatory "Password" field is empty or is not valid.'
        })
    }
    if(password2.length < 4 || !password2 || password2 === undefined || password2 === null){
        errors.push({
            status: 422,
            message: 'Mandatory "Repeat Password" field is empty or is not valid.'
        })
    }
    if(password !== password2){
        errors.push({
            status: 422,
            message: `Passwords don't match.`
        })
    }
    if(errors.length > 0){
        res.render('user/register', {errors: errors})
    } else {
        const user = {
            name,
            email,
            password
        }
        User.findOne({email: email}).then((userFound) => {
            console.log(userFound)
            if(userFound){
                errors.push({
                        status: 422,
                        message: 'User creation failed, this user E-mail is already registered.'
                    })
                res.render('user/register', {errors: errors})
            } else {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(user.password, salt, (err, hash) => {
                        user.password = hash
                        User.create(user).then(() => {
                            req.flash('success_msg', `${name} register complete.`)
                            res.redirect('/')
                        }).catch((err) => {
                            req.flash('error_msg', `That is an error in saving the user ${name} in the database.`)
                                errors.push({
                                    status: err.status,
                                    message: 'User creation failed on database. Seek support assistance.'
                                })
                            res.render('user/register', {errors: errors})
                        })
                    })
                })
            }
        }).catch((err) => {
            errors.push({
                status: err.status,
                message: 'User creation failed on database. Seek support assistance.'
            })
            res.render('user/register', {errors: errors})
        })
    }
})

router.get('/login', (req, res) => {
    res.render('user/login')
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', (req, res) => {
    req.logOut((err) => {
        if(err) 
            return next(err)

        req.flash('success_msg', 'Logged Out.')
        res.redirect('/')
    })
})

module.exports = router