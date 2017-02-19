const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../models/user')
const config = require('../config/db.json')

module.exports = function(passport) {
    let opt = {}
    opt.jwtFromRequest = ExtractJwt.fromAuthHeader()
    opt.secretOrKey = config.secret
    passport.use(new JwtStrategy(opt, (jwt_payload, done) => {
    	console.log(jwt_payload)
    	User.getUserById(jwt_payload._doc._id, (err, user)=>{
    		if(err){
    			return done(err, false)
    		}
    		if(user){
    			return done(null, user)
    		}else {
    			return done(null, false)
    		}
    	})
    }))
}