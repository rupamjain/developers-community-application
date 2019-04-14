const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
	let errs = {};

	data.title = !isEmpty(data.title) ? data.title : '';
	data.company = !isEmpty(data.company) ? data.company : '';
	data.from = !isEmpty(data.from) ? data.from : '';

	if (validator.isEmpty(data.title)) {
		errs.title = 'Title field is required';
	}
	if (validator.isEmpty(data.company)) {
		errs.company = 'Company field is required';
	}
	if (validator.isEmpty(data.from)) {
		errs.from = 'From date field is required';
	}

	return {
		errs,
		isValid: isEmpty(errs)
	};
};
