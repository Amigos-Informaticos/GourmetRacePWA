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

		async get(resource) {
			let response = await fetch(this._url + "/" + resource, {
				method: 'GET',
				headers: {'Content-Type': 'application/json'}
			});
			return await response.blob();
		}

		async post(resource, jsonPayload = {}, payback = false) {
			return fetch(this._url + '/' + resource, {
				method: 'post',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(jsonPayload)
			}).then(response => {
				if (payback) {
					return response.json();
				} else {
					return response.status;
				}
			}).catch(error => error);
		}
	}

	module.exports = Connection;
} catch (e) {
}
