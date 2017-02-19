const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const config = require('../config/db.json')

const User = require('../models/user')
    // Register Route 
router.post('/register', (req, res, next) => {
    console.log("REGISTER" + JSON.stringify(req.body))
    let newUser = new User({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email

    })
    console.log(newUser)
    User.addUser(newUser, (err, user) => {
        if (err) {
            res.json({
                success: false,
                msg: "Failed To register"
            })
        } else {
            res.json({
                success: true,
                msg: "User Registred"
            })
        }
    })

})

// AUth Route 
router.post('/auth', (req, res, next) => {
    // res.send("Auth")
    let username = req.body.username
    let password = req.body.password
    User.getUserByUsername(username, (err, user) => {
        if (err) throw err
        if (!user) {
            return res.json({
                success: false,
                msg: "User unregistred"
            })
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err
            if (isMatch) {
                const token = jwt.sign(user, config.secret, {
                    expiresIn: 604800 // 1 week
                })
                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                })
            }
        })

    })
})

// Profile Route 
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	
    res.json({user: req.user})
})
module.exports = router