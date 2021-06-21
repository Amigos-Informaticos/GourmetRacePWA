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

	const connection = new Connection("https://amigosinformaticos.ddns.net:42066");
	const restaurantId = 5;

	connection.send("get", `restaurants/${restaurantId}/comments`)
		.then(jsonResponse => {
			callback(jsonResponse);
		}).catch(error => {
		done(error)
	});
});