class Commensal {
	_id;
	_email;
	_username;
	_password;
	_status;
	_isOwner;
	_connection;

	constructor(email, username, password) {
		this._email = email;
		this._password = password;
		this._username = username;
	}

	get email() {
		return this._email;
	}

	get id() {
		return this._id;
	}

	set id(value) {
		this._id = value;
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

	get status() {
		return this._status;
	}

	get username() {
		return this._username;
	}

	set username(value) {
		this._username = value;
	}

	set status(value) {
		this._status = value;
	}

	get isOwner() {
		return this._isOwner;
	}

	set isOwner(value) {
		this._isOwner = value;
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
} catch (e) {

}