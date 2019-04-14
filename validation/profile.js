const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatedProfileInput(data) {
	let errs = {};

	data.handle = !isEmpty(data.handle) ? data.handle : '';
	data.status = !isEmpty(data.status) ? data.status : '';
	data.skills = !isEmpty(data.skills) ? data.skills : '';
	data.bio = !isEmpty(data.bio) ? data.bio : '';

	if (!validator.isLength(data.handle, { min: 2, max: 30 })) {
		errs.handle = 'Handle length should be between 2 to 30';
	}
	if (validator.isEmpty(data.handle)) {
		errs.handle = 'Handle is required.';
	}
	if (validator.isEmpty(data.status)) {
		errs.status = 'Status is required.';
	}
	if (validator.isEmpty(data.skills)) {
		errs.skills = 'skills are required.';
	}

	if (!isEmpty(data.website)) {
		if (!validator.isURL(data.website)) {
			errs.website = 'Not a valid URL';
		}
	}

	if (!isEmpty(data.twitter)) {
		if (!validator.isURL(data.twitter)) {
			errs.twitter = 'Not a valid URL';
		}
	}

	if (!isEmpty(data.youtube)) {
		if (!validator.isURL(data.youtube)) {
			errs.youtube = 'Not a valid URL';
		}
	}

	if (!isEmpty(data.facebook)) {
		if (!validator.isURL(data.facebook)) {
			errs.facebook = 'Not a valid URL';
		}
	}

	if (!isEmpty(data.instagram)) {
		if (!validator.isURL(data.instagram)) {
			errs.instagram = 'Not a valid URL';
		}
	}

	if (!isEmpty(data.linkedin)) {
		if (!validator.isURL(data.linkedin)) {
			errs.linkedin = 'Not a valid URL';
		}
	}

	return {
		errs,
		isValid: isEmpty(errs)
	};
};
