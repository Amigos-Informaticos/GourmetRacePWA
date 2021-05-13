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

	const connection = new Connection("http://0.0.0.0:42066");
	const payload = {
		"email": "alexisao@correo.com",
		"password": "password",
		"username": "alexisaO"
	}
	connection.send('post', "commensals", payload)
		.then(responseStatus => {
			callback(responseStatus);
		});
});