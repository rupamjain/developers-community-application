const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const validateProfileInput = require('../../validation/profile.js');
const validateExpInput = require('../../validation/experience.js');
const validateEduInput = require('../../validation/education.js');

//@route GET api/profile/test

//@desc Tests profile route
//@access private

router.get('/test', (res, req) => {
	res.json({
		msg: 'profile works'
	});
});

//@route GET api/profile
//@desc Get current user's profile
//@access private

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	errs = {};
	Profile.findOne({ user: req.user.id })
		.populate('user', [ 'name', 'avatar' ])
		.then((profile) => {
			if (!profile) {
				errs.noprofile = 'THere is no profile for this user';
				return res.status(404).json(errs);
			}
			res.json(profile);
		})
		.catch((e) => releaseEvents.status(404).json(e));
});

//@route GET api/profile/handle/:handle
//@desc GET profile by handle
//@access public

router.get('/handle/:handle', (req, res) => {
	const errs = {};
	Profile.findOne({ handle: req.params.handle })
		.populate('user', [ 'name', 'avatar' ])
		.then((profile) => {
			if (!profile) {
				errs.noprofile = 'There is no profile for this user.';
				res.status(404).json(errs);
			}
			res.json(profile);
		})
		.catch((e) => res.status(404).json(e));
});

//@route GET api/profile/all
//@desc GET profile by handle
//@access public

router.get('/all', (req, res) => {
	const errs = {};
	Profile.find()
		.populate('user', [ 'name', 'avatar' ])
		.then((profiles) => {
			if (!profiles) {
				errs.noprofile = 'There are no profiles.';
				res.status(404).json(errs);
			}
			res.json(profiles);
		})
		.catch((e) => res.status(404).json({ noprofile: 'There is no profile for this user.' }));
});

//@route GET api/profile/user/:user_id
//@desc GET profile by User Id
//@access public

router.get('/user/:id', (req, res) => {
	const errs = {};
	Profile.findOne({ user: req.params.id })
		.populate('user', [ 'name', 'avatar' ])
		.then((profile) => {
			if (!profile) {
				errs.noprofile = 'There is no profile for this user.';
				res.status(404).json(errs);
			}
			res.json(profile);
		})
		.catch((e) => res.status(404).json({ noprofile: 'There is no profile for this user.' }));
});

//@route POST api/profile
//@desc Create or Edit Profiles
//@access private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	//validation
	const { errs, isValid } = validateProfileInput(req.body);

	//check validation
	if (!isValid) {
		return res.status(400).json(errs);
	}

	//Get fields
	const profileFields = {};
	profileFields.social = {};
	profileFields.user = req.user.id;
	const whiteList = [
		'handle',
		'company',
		'website',
		'bio',
		'status',
		'githubusername',
		'skills',
		'youtube',
		'facebook',
		'twitter',
		'instagram',
		'linkedin'
	];
	const inputData = Object.keys(req.body);

	for (key of inputData) {
		if (whiteList.includes(key)) {
			if (key === 'skills' && typeof req.body.skills !== 'undefined') {
				profileFields[key] = req.body.skills.split(',');
			} else if ([ 'youtube', 'twitter', 'instagram', 'facebook', 'linkedin' ].includes(key) && req.body[key]) {
				profileFields.social[key] = req.body[key];
			} else if (req.body[key]) {
				profileFields[key] = req.body[key];
			}
		}
	}

	Profile.findOne({ user: req.user.id }).then((profile) => {
		if (profile) {
			Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true }).then((profile) =>
				res.json(profile)
			);
		} else {
			//create
			//check handles
			Profile.findOne({ handle: profileFields.handle }).then((profile) => {
				if (profile) {
					errs.handle = 'That handle already exists';
					res.status(400).json(errs);
				}
				new Profile(profileFields).save().then((profile) => res.json(profile));
			});
		}
	});
});

//@route POST api/profile/experience
//@desc Add experience to profile
//@access private

router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errs, isValid } = validateExpInput(req.body);

	//check validation
	if (!isValid) {
		return res.status(400).json(errs);
	}

	Profile.findOne({ user: req.user.id }).then((profile) => {
		const newExp = {
			title: req.body.title,
			company: req.body.company,
			location: req.body.loaction,
			from: req.body.from,
			to: req.body.to,
			current: req.body.current,
			description: req.body.description
		};

		//Add to experience array
		profile.experience.unshift(newExp);
		profile.save().then((profile) => res.json(profile));
	});
});

//@route POST api/profile/education
//@desc Add education to profile
//@access private

router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errs, isValid } = validateEduInput(req.body);

	//check validation
	if (!isValid) {
		return res.status(400).json(errs);
	}

	Profile.findOne({ user: req.user.id }).then((profile) => {
		const newEdu = {
			school: req.body.school,
			degree: req.body.degree,
			fieldofstudy: req.body.fieldofstudy,
			from: req.body.from,
			to: req.body.to,
			current: req.body.current,
			description: req.body.description
		};

		//Add to experience array
		profile.education.unshift(newEdu);
		profile.save().then((profile) => res.json(profile));
	});
});

//@route DELETE api/profile/experience/:exp_id
//@desc Delete experience from profile
//@access private
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id }).then((profile) => {
		//Get remove index
		const removeIndex = profile.experience.map((item) => item.id).indexOf(req.params.exp_id);
		profile.experience.splice(removeIndex, 1);
		profile
			.save()
			.then((profile) => {
				res.json(profile);
			})
			.catch((e) => res.json(e));
	});
});

//@route DELETE api/profile/education/:edu_id
//@desc Delete education from profile
//@access private
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id }).then((profile) => {
		//Get remove index
		const removeIndex = profile.education.map((item) => item.id).indexOf(req.params.edu_id);
		profile.education.splice(removeIndex, 1);
		profile
			.save()
			.then((profile) => {
				res.json(profile);
			})
			.catch((e) => res.json(e));
	});
});

//@route DELETE api/profile
//@desc Delete profile and user
//@access private
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOneAndDelete({ user: req.user.id }).then(() => {
		User.findOneAndDelete({ _id: req.user.id }).then(() => {
			res.json({ success: 'user deleted' });
		});
	});
});

module.exports = router;
