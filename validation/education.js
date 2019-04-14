const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateEducationInput(data) {
	let errs = {};

	data.school = !isEmpty(data.school) ? data.school : '';
	data.degree = !isEmpty(data.degree) ? data.degree : '';
	data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
	data.from = !isEmpty(data.from) ? data.from : '';

	if (validator.isEmpty(data.school)) {
		errs.school = 'School field is required';
	}
	if (validator.isEmpty(data.degree)) {
		errs.degree = 'Degree field is required';
	}
	if (validator.isEmpty(data.fieldofstudy)) {
		errs.fieldofstudy = 'Fieldofstudy date field is required';
	}
	if (validator.isEmpty(data.from)) {
		errs.from = 'From date field is required';
	}

	return {
		errs,
		isValid: isEmpty(errs)
	};
};
