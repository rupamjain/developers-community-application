const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
	let errs = {};

	data.name = !isEmpty(data.name) ? data.name : '';
	data.email = !isEmpty(data.email) ? data.email : '';
	data.password = !isEmpty(data.password) ? data.password : '';
	data.password2 = !isEmpty(data.password2) ? data.password2 : '';

	if (!validator.isLength(data.name, { min: 2, max: 30 })) {
		errs.name = 'Name must be between 2 and 30 characters';
	}
	if (validator.isEmpty(data.name)) {
		errs.name = 'Name field is required';
	}
	if (!validator.isEmail(data.email)) {
		errs.email = 'Enter a correct email address.';
	}
	if (validator.isEmpty(data.email)) {
		errs.email = 'Email field is required';
	}
	if (!validator.isLength(data.password, { min: 6, max: 30 })) {
		errs.password = 'Password should contain minimum six characters';
	}
	if (validator.isEmpty(data.password)) {
		errs.password = 'Password field is required';
	}
	if (!validator.equals(data.password, data.password2)) {
		errs.password2 = 'Passwords must match';
	}
	if (validator.isEmpty(data.password2)) {
		errs.password2 = 'Confirm Password field is required';
	}

	return {
		errs,
		isValid: isEmpty(errs)
	};
};
