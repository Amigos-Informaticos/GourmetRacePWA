class Commensal {
	_email;
	_password;

	constructor(email, password) {
		this._email = email;
		this._password = password;
	}

	get email() {
		return this._email;
	}

	get password() {
		return this._password;
	}

	set email(email) {
		if (this.isEmail(email)) {
			this._email = email;
		}
	}

	set password(password) {
		if (this.isPassword(password)) {
			this._password = password;
		}
	}

	isEmail(email) {
		return email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) != null;
	}

	isPassword(password) {
		return password.match(/^(?=.*?[0-z]).{8,}$/) != null;
	}
}

try {
	module.exports = Commensal;
} catch (referenceError) {
	console.log(referenceError.message);
}
