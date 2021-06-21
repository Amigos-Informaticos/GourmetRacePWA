const Connection = require("../js/connection/connection");

const url = "https://amigosinformaticos.ddns.net:42066";
const idRestaurant = 5;
let token = null;
let idComment = null;

test("Get comments from restaurant", done => {
	function callback(data) {
		try {
			if (data.status === 200) {
				expect(data.status).toBe(200);
			} else {
				expect(data.status).toBe(204);
			}
			done();
		} catch (error) {
			done(error);
		}
	}

	const connection = new Connection(url);

	connection.send("get", `restaurants/${idRestaurant}/comments`)
		.then(jsonResponse => {
			callback(jsonResponse);
		}).catch(error => {
		done(error)
	});
});

test("Make a comment", done => {
	function callback(data) {
		if (data.status === 201) {
			idComment = data["json"]["comment_id"];
		}
		expect(data.status).toBe(201);
	}

	const connection = new Connection(url);
	const loginPayload = {
		email: "gt@walom.com",
		password: "password"
	};

	const commentPayload = {
		comment: "Comentario de prueba unitaria",
		date: "2021-06-10"
	};
	connection.send("POST", "login", null, loginPayload)
		.then(response => {
			Connection.token = response["json"]["token"];
			token = response["json"]["token"];
			commentPayload["id_commensal"] = response["json"]["id"];

			connection.send(
				"POST",
				`restaurants/${idRestaurant}/comments`,
				commentPayload
			)
				.then(response => {
					callback(response);
				})
				.catch(error => done(error));
		})
		.catch(error => done(error));
});

test("Delete a comment", done => {
	if (idComment !== null) {
		Connection.token = token;
		const connection = new Connection(url);
		connection.send(
			"DELETE",
			`restaurants/${idRestaurant}/comments/${idComment}`
		)
			.then(response => {
				callback(response);
			})
			.catch(error => done(error));
	} else {
		fail("Id comment is null");
	}

	function callback(data) {
		expect(data).toBe(200);
	}
});