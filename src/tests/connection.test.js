const Connection = require("../js/connection/connection");

test("Register user test", done => {
	const expectedResponseRegister = {
		"status": 201,
		"json": {
			"email": "alexisao@correo.com",
			"password": "password",
			"username": "alexisaO",
			"status": true,
			"is_owner": false
		}
	}
	const userAlreadyRegistered = {"status": 409}

	function callback(data) {
		try {
			if (data.status === 201) {
				expect(data).toStrictEqual(expectedResponseRegister);
			} else {
				expect(data).toStrictEqual(userAlreadyRegistered);
			}
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
	connection.send('post', "commensals", {}, payload, false)
		.then(jsonResponse => {
			callback(jsonResponse);
		});
});

test("Search registered user test", done => {
	const expectedResponse = {
		"status": 200,
		"json": [{
			"email": "alexisao@correo.com",
			"password": "password",
			"username": "alexisaO",
			"status": true,
			"is_owner": false
		}]
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
	const parameters = {
		username: "alexisaO",
		email: "alexisao@correo.com"
	}
	connection.send("get", "commensals", parameters, null)
		.then(jsonResponse => {
			callback(jsonResponse);
		});
});

test("Get registered user test", done => {
	const connection = new Connection("http://amigosinformaticos.ddns.net:42066");
	let payload = {
		email: "alexisao@correo.com",
		password: "password"
	}
	connection.send("post", "login", null, payload)
		.then(response => {
			Connection.token = response["json"]["token"];
			connection.send(
				"get",
				"commensals/" + response["json"]["id"],
				null,
				null
			).then(newResponse => callback(newResponse));
		});

	const expectedResponse = {
		"status": 200,
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
});

test("Login", done => {
	let payload = {
		email: "alexisao@correo.com",
		password: "password"
	}

	const connection = new Connection("http://amigosinformaticos.ddns.net:42066");
	connection.send("POST", "login", null, payload)
		.then(response => {
			console.log(response["json"]["id"]);
		});
});