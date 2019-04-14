const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
	let errs = {};

	data.email = !isEmpty(data.email) ? data.email : '';
	data.password = !isEmpty(data.password) ? data.password : '';

	if (!validator.isEmail(data.email)) {
		errs.email = 'Enter a correct email address.';
	}
	if (validator.isEmpty(data.email)) {
		errs.email = 'Email field is required';
	}
	if (validator.isEmpty(data.password)) {
		errs.password = 'Password field is required';
	}

	return {
		errs,
		isValid: isEmpty(errs)
	};
};
