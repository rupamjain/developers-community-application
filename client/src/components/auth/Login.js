import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/authActions';
import classnames from 'classnames';

class Login extends Component {
	constructor() {
		super();
		this.state = {
			email: '',
			password: '',
			errors: {}
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	/*componentWillReceiveProps(nextProps) {
		if (nextProps.auth.isAuthenticated) {
			this.props.history.push('/dashboard');
		}

		if (nextProps.errors) {
			this.setState({ errors: nextProps.errors });
		}
	}*/

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.auth.isAuthenticated) {
			console.log(nextProps);
			nextProps.history.push('/dashboard');
		}

		if (nextProps.errors) {
			return { errors: nextProps.errors }; // <- this is setState equivalent this.setState({ errors: nextProps.errors });
		} else {
			return { errors: nextProps.errors };
		}
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}
	onSubmit(e) {
		e.preventDefault();
		const User = {
			email: this.state.email,
			password: this.state.password
		};
		this.props.loginUser(User);
	}

	render() {
		const { errors } = this.state;

		return (
			<div>
				<div className="login">
					<div className="container">
						<div className="row">
							<div className="col-md-8 m-auto">
								<h1 className="display-4 text-center">Log In</h1>
								<p className="lead text-center">Sign in to your DevConnector account</p>
								<form onSubmit={this.onSubmit}>
									<div className="form-group">
										<input
											type="email"
											className={classnames('form-control form-control-lg', {
												'is-invalid': errors.email
											})}
											placeholder="Email Address"
											name="email"
											value={this.state.email}
											onChange={this.onChange}
										/>
										<div className="invalid-feedback">{errors.email}</div>
									</div>
									<div className="form-group">
										<input
											type="password"
											className={classnames('form-control form-control-lg', {
												'is-invalid': errors.password
											})}
											placeholder="Password"
											name="password"
											value={this.state.password}
											onChange={this.onChange}
										/>
										<div className="invalid-feedback">{errors.password}</div>
									</div>
									<input type="submit" className="btn btn-info btn-block mt-4" />
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

Login.propTypes = {
	loginUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	errors: state.errors
});

export default connect(mapStateToProps, { loginUser })(Login);
