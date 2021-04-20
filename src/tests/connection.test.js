const Connection = require("../js/connection/connection");

test("Register user test", done => {
	function callback(data) {
		try {
			expect(data).toBe(201);
			done();
		} catch (error) {
			done(error);
		}
	}

	const connection = new Connection("http://amigosinformaticos.ddns.net:42066");
	const payload = {
		"email": "b@b.com",
		"password": "password",
		"username": "username"
	}
	connection.post("commensals", payload)
		.then(responseStatus => {
			callback(responseStatus);
		});
});