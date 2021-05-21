$("#registerButton").click(function () {
	loadContent("src/view/register.html");
});

$("#loginButton").click(function () {
	let email = $("#emailInput").val();
	let password = $("#passwordInput").val();
	if (validateLogin()) {
		login(email, password)
			.then(success => {
				if (success) {
					Swal.fire({
						icon: 'success',
						title: 'Correcto',
						text: ''
					});
				} else {
					Swal.fire({
						icon: "error",
						title: "Credenciales incorrectas"
					});
				}
			});
	} else {
		Swal.fire({
			icon: 'error',
			title: 'Campos incorrectos',
			text: 'Uno o más campos son incorrectos'
		});
	}
});

async function login(email, password) {
	const payload = {
		"email": email,
		"password": password
	}

	const connection = new Connection("http://amigosinformaticos.ddns.net:42066");
	const respuesta = await connection.send("post", "login", null, payload);
	if (respuesta["status"] === 200) {
		localStorage.setItem("token", respuesta["json"]["token"]);
	}
	return respuesta["status"] === 200;
}

function validateLogin() {
	let commensal = new Commensal();
	let email = $("#emailInput").val();
	let password = $("#passwordInput").val();
	return commensal.isEmail(email) && commensal.isPassword(password);
}
