const express = require('express');
const router = express.Router();
//Load User model
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jkey = require('../../config/keys');
const passport = require('passport');

//Load input validation
const validateRegisterInput = require('../../validation/register.js');

const validateLoginInput = require('../../validation/login.js');

//@route GET api/users/test
//@desc Tests users route
//@access public

router.get('/test', (res, req) => {
	res.json({
		msg: 'user works'
	});
});

//@route POST api/users/register
//@desc Tests users route
//@access public
router.post('/register', (req, res) => {
	const { errs, isValid } = validateRegisterInput(req.body);
	//check validation
	if (!isValid) {
		return res.status(400).json(errs);
	}

	User.findOne({ email: req.body.email }).then((user) => {
		if (user) {
			errs.email = 'Email already exists!';
			return res.status(400).json(errs);
		} else {
			const avatar = gravatar.url(req.body.email, { s: '200', r: 'pg', d: 'mm' });
			const newUser = new User({
				name: req.body.name,
				email: req.body.email,
				avatar,
				password: req.body.password
			});
			bcrypt.hash(newUser.password, 10, function(err, hash) {
				if (err) throw err;
				newUser.password = hash;
				newUser.save().then((body) => res.json(body)).catch((e) => console.log(e));
			});
		}
	});
});

//@route POST api/users/login
//@desc Tests users route
//@access public

router.post('/login', (req, res) => {
	const { errs, isValid } = validateLoginInput(req.body);

	//check validation
	if (!isValid) {
		return res.status(400).json(errs);
	}

	const email = req.body.email;
	const password = req.body.password;

	User.findOne({ email: email }).then((user) => {
		if (!user) {
			errs.email = 'User Not Found';
			return res.status(404).json(errs);
		}
		bcrypt.compare(password, user.password).then((check) => {
			if (check) {
				//User logged in
				const payload = { id: user.id, name: user.name, avatar: user.avatar }; //jwt payload
				//console.log(res.json({ hmm: user.id }));
				jwt.sign(payload, jkey.jwtkey, { expiresIn: 3600 }, (err, token) => {
					res.json({
						success: true,
						token: 'Bearer ' + token
					});
				});

				//return res.json({ msg: 'success' });
			} else {
				errs.password = 'Password Incorrect';
				return res.status(404).json(errs);
			}
		});
	});
});

//@route GET api/users/current
//@desc return current user
//@access private

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
	res.json({
		id: req.user.id,
		name: req.user.name,
		email: req.user.email
	});
});

module.exports = router;

/*
We cam also use module.exports={
    users:router
};
and while importing
const {users}=require('./routes/api/users') 
*/
