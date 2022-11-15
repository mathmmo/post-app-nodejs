const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/User')


module.exports = (passport) => {
    passport.use(new localStrategy({usernameField: 'email'}, (email, password, done) => {
        User.findOne({email: email}).lean().then((user) => {
            if(!user){
                return done(null, false, {message: 'This user dont exist.'})
            }

            bcrypt.compare(password, user.password, (err, match) => {
                if(match){
                    return done(null, user)
                } else {
                    return done(null, false, {message: 'Password is incorrect.'})
                }
            })
        })
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}