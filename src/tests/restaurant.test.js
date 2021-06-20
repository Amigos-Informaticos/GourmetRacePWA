const Connection = require("../js/connection/connection");

test("Register restaurant", done => {
	function callback(response) {
		console.log(response);
		try {
			if (response.status === 201) {
				expect(response.json.id).toBe(true)
			} else {
				expect(response.status).toBe(409);
			}
			done();
		} catch (error) {
			done(error);
		}
	}
	const payload = {
		email: "edsonmidguet@gmail.com",
		password: "beethoven"
	}
	const connection = new Connection("https://amigosinformaticos.ddns.net:42066");
	connection.send("post", "login", null, payload)
		.then(response => {
			if (response.status == 200){
				Connection.token = response["json"]["token"];
				let idCommensal = response.json.id;
				let payloadRestaurant = {
					"name": "Comida corrida La Vecina",
					"category": 12,//Comida mexicana
					"service_type": 1,//Servicio de mesa
					"registered_by": 112,
					"location": "www.paginaweb.com",
					"price": 1//$
				}
				connection.send(
					"post",
					"restaurants",
					null,
					payloadRestaurant
				).then(newResponse => callback(newResponse));
			}
		});
});
test("Edit restaurant", done => {
	function callback(response) {
		console.log(response);
		try {
			if (response.status === 201) {
				expect(response.json.id).toBe(true)
			} else {
				expect(response.status).toBe(409);
			}
			done();
		} catch (error) {
			done(error);
		}
	}
	const payload = {
		email: "gt@walom.com",
		password: "password"
	}
	const connection = new Connection("https://amigosinformaticos.ddns.net:42066");
	connection.send("post", "login", null, payload)
		.then(response => {
			console.log(response);
			if (response.status == 200){
				Connection.token = response["json"]["token"];
				let idCommensal = response.json.id;
				let payloadRestaurant = {
					"name": "La Cocina de Jay 777",
					"category": 7,
					"location": "https://g.page/lacocinadeljey?share",
					"price": 1
				}
				connection.send(
					"post",
					`restaurants/${5}`,
					null,
					payloadRestaurant
				).then(newResponse => {
					callback(newResponse)
				}).catch(error=>{
					done(error);
				});
			} else {
				fail(`Login error ${response.status}`);
			}
		}).catch(errorLogin => {done(errorLogin)});
});
test("Get restaurants", done => {
	function callback(data) {
		try {
			expect(data.status).toBe(200);
			done();
		} catch (error) {
			done(error);
		}
	}
	const connection = new Connection("https://amigosinformaticos.ddns.net:42066");
	connection.send("get", "restaurants")
		.then(jsonResponse => {
			callback(jsonResponse);
		});
});
test("Get restaurant by id", done => {
	function callback(data) {
		try {
			if (data.status == 200){
				expect(data.status).toBe(200);
			} else if (data.stats == 404){
				expect(data.status).toBe(404);
			}
			done();
		} catch (error) {
			done(error);
		}
	}
	const connection = new Connection("https://amigosinformaticos.ddns.net:42066");
	const parameters = {
		restaurant_id: 5
	}
	connection.send("get", `restaurants/${parameters.restaurant_id}`)
		.then(jsonResponse => {
			callback(jsonResponse);
		});
});
test("Get comments from restaurant", done => {
	function callback(data) {
		try {
			if (data.status == 200){
				expect(data.status).toBe(200);
			} else if (data.stats == 404){
				expect(data.status).toBe(204);
			}
			done();
		} catch (error) {
			done(error);
		}
	}
	const connection = new Connection("https://amigosinformaticos.ddns.net:42066");
	const parameters = {
		restaurant_id: 5
	}
	connection.send("get", `restaurants/${parameters.restaurant_id}/comments`)
		.then(jsonResponse => {
			callback(jsonResponse);
		}).catch(error => {done(error)});
});