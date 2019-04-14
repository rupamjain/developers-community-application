const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('../config/keys.js');

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.jwtkey;

module.exports = (passport) => {
	passport.use(
		new JwtStrategy(opts, (jwt_payload, done) => {
			//console.log(jwt_payload);
			User.findById(jwt_payload.id)
				.then((user) => {
					if (user) {
						done(null, user);
					} else {
						done(null, false);
					}
				})
				.catch((e) => console.log(e));
		})
	);
};
