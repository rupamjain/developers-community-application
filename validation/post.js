const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
	let errs = {};

	data.text = !isEmpty(data.text) ? data.text : '';

	if (!validator.isLength(data.text, { min: 10, max: 350 })) {
		errs.text = 'Post must be between 10 to 350 characters!';
	}

	if (validator.isEmpty(data.text)) {
		errs.text = 'Post is empty.';
	}

	return {
		errs,
		isValid: isEmpty(errs)
	};
};
