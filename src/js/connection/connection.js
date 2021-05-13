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

		async send(method, endpoint, payload = {}, payback = false) {
			return fetch(this.url + '/' + endpoint, {
				method: method,
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(payload)
			}).then(response => {
				if (payback) {
					return {
						json: response.json(),
						status: response.status
					};
				} else {
					return response.status;
				}
			}).catch(error => error);
		}
	}

	module.exports = Connection;
} catch (e) {
}
