try {
	const fetch = require("node-fetch");

	class Connection {
		constructor(url) {
			this._url = url;
		}

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

		async send(method, endpoint, parameters = {}, payload = {}, payback = false) {
			let queryString = this.buildParams(parameters);
			const response = await fetch(this.url + '/' + endpoint + queryString, {
				method: method,
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(payload)
			});
			if (!payback) {
				return response.status;
			} else {
				return response.json().then(values => {
					return {
						status: response.status,
						json: values
					}
				});
			}
		}
	}

	module.exports = Connection;
} catch (e) {
}
