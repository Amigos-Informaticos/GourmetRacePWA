const Connection = require("../js/connection/connection");

test("Register user test", done => {
	const expectedResponse = {
		"status": 201,
		"json": {
			"email": "alexisao@correo.com",
			"password": "password",
			"username": "alexisaO",
			"status": true,
			"is_owner": false
		}
	}

	function callback(data) {
		try {
			expect(data).toStrictEqual(expectedResponse);
			done();
		} catch (error) {
			done(error);
		}
	}

	const connection = new Connection("http://amigosinformaticos.ddns.net:42066");
	const payload = {
		"email": "alexisao@correo.com",
		"password": "password",
		"username": "alexisaO"
	}
	connection.send('post', "commensals", {}, payload, true)
		.then(jsonResponse => {
			callback(jsonResponse);
		});
});
