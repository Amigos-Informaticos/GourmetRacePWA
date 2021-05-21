try {
	const fetch = require("node-fetch");
	const FormData = require("form-data");

	class Connection {
		constructor(url) {
			this._url = url;
		}

		static token = null;
		static keepCookies = true;
		static cookies = null;

		get url() {
			return this._url;
		}

		set url(value) {
			this._url = value;
		}

		buildParams(parameters = null) {
			let queryString = "";
			if (parameters != null || parameters != undefined) {
				let size = Object.keys(parameters).length;
				let index = 0;
				if (size > 0) {
					queryString += "?";
					for (let key in parameters) {
						queryString += key + "=" + parameters[key];
						if (index < size - 1) {
							queryString += "&";
						}
						index++;
					}
				}
			}
			return queryString;
		}

		buildBody(method, payload = null, isMultipart = false) {
			let options = {
				method: method,
				headers: {}
			};
			if (payload != null) {
				if (isMultipart) {
					const form = new FormData();
					for (const key in payload) {
						form.append(key, payload[key]);
					}
					options.body = form;
				} else {
					options.headers["Content-Type"] = "application/json";
					options.body = JSON.stringify(payload);
				}
			}
			if (Connection.token != null) {
				options.headers["Token"] = Connection.token;
			}
			if (Connection.keepCookies && Connection.cookies != null) {
				options.headers["Cookie"] = Connection.cookies;
			}
			return options;
		}

		async send(method, endpoint, parameters = null, payload = null, isMultipart = false) {
			let queryString = this.buildParams(parameters);
			let header = this.buildBody(method, payload, isMultipart);

			const response = await fetch(this.url + '/' + endpoint + queryString, header);

			const contentType = response.headers.get("content-type");
			const cookies = response.headers.get("Set-Cookie");
			if (cookies && Connection.keepCookies) {
				Connection.cookies = cookies;
			}
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
	
} catch (e) {
}
