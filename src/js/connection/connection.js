try {
	const fetch = require("node-fetch");

	class Connection {
		constructor(url) {
			this._url = url;
		}

		static token = null;

		get url() {
			return this._url;
		}

		set url(value) {
			this._url = value;
		}

		buildParams(parameters = {}) {
			let queryString = "";
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
			return queryString;
		}

		buildBody(method, payload = null) {
			let options = {method: method};
			if (payload != null) {
				options.headers = {'Content-Type': 'application/json'};
				options.body = JSON.stringify(payload);
			}
			if (Connection.token != null) {
				options.Token = Connection.token;
			}
			return options;
		}

		async send(method, endpoint, parameters = {}, payload = null) {
			let queryString = this.buildParams(parameters);
			let header = this.buildBody(method, payload);

			const response = await fetch(this.url + '/' + endpoint + queryString, header);

			const contentType = response.headers.get("content-type");
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

	module.exports = Connection;
} catch (e) {
}
