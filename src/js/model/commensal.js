try {
	class Commensal {
		email;
		password;

		constructor(email, password) {
			this.email = email;
			this.password = password;
		}

		get email() {
			return this.email;
		}

		get password() {
			return this.password;
		}

		set email(email) {
			if (this.isEmail(email)) {
				this.email = email;
			}
		}

		set password(password) {
			if (this.isPassword(password)) {
				this.password = password;
			}
		}

		isEmail(email) {
			return email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) != null;
		}

		isPassword(password) {
			return password.match(/^(?=.*?[0-z]).{8,}$/) != null;
		}
	}

	module.exports = Commensal;
} catch (referenceError) {

}
