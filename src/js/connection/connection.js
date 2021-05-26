try {
	var fetch = require("node-fetch");
	var FormData = require("form-data");
} catch (e) {

}

class Connection {
	constructor(url) {
		this._url = url;
	}

	static token = null;
	static keepCookies = true;
	static cookies = null;
	static requiredContent = null;

	get url() {
		return this._url;
	}

	set url(value) {
		this._url = value;
	}

	buildParams(parameters = null) {
		let queryString = "";
		if (parameters != null) {
			let size = Object.keys(parameters).length;
			let index = 0;
			queryString += "?";
			for (let key in parameters) {
				queryString += key + "=" + parameters[key];
				if (index < size - 1) {
					queryString += "&";
				}
				index++;
			}
		}
		return queryString;
	}

	buildBody(method, payload = null, isMultipart = false) {
		let options = {
			method: method,
			headers: {"Access-Control-Allow-Origin": "*"}
		};
		if (payload != null) {
			if (isMultipart) {
				options.body = new FormData();
				for (const key in payload) {
					options.body.append(key, payload[key]);
				}
			} else {
				options.headers["Content-Type"] = "application/json";
				options.body = JSON.stringify(payload);
			}
		}
		options = this.setToken(options);
		options = this.setRequiredContent(options);
		return this.setCookies(options);
	}

	setRequiredContent(options) {
		if (Connection.requiredContent != null) {
			options.headers["Required-Content"] = Connection.requiredContent;
		}
		Connection.requiredContent = null;
		return options;
	}

	setCookies(options) {
		if (Connection.keepCookies && Connection.cookies != null) {
			options.headers["Cookie"] = Connection.cookies;
		}
		return options;
	}

	setToken(options) {
		if (Connection.token != null) {
			options.headers["Token"] = Connection.token;
		}
		return options;
	}

	saveCookies(cookies) {
		if (cookies && Connection.keepCookies) {
			Connection.cookies = cookies;
		}
	}

	async send(method, endpoint, parameters = null, payload = null, isMultipart = false) {
		let queryString = this.buildParams(parameters);
		let header = this.buildBody(method, payload, isMultipart);
		const response = await fetch(this.url + "/" + endpoint + queryString, header);
		const contentType = response.headers.get("content-type");
		this.saveCookies(response.headers.get("Set-Cookie"));
		if (contentType && contentType.indexOf("application/json") !== -1) {
			return response.json().then(value => {
				return {
					status: response.status,
					json: value
				};
			});
		}
		return {status: response.status};
	}
}

try {
	module.exports = Connection;
} catch (error) {
	console.log(error);
}