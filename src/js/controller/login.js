async function login(email, password) {
	const payload = {email, password};
	const connection = new Connection("http://amigosinformaticos.ddns.net:42066");
	const response = await connection.send("post", "login", null, payload);
	return response;
}

function validateLogin() {
	let commensal = new Commensal();
	let email = $("#emailInput").val();
	let password = $("#passwordInput").val();
	return commensal.isEmail(email) && commensal.isPassword(password);
}

$("#registerButton").click(function () {
	window.location="./src/view/register.html";
});

$("#loginForm").submit(function(event) {
	console.log("click");
	let email = $("#emailInput").val();
	let password = $("#passwordInput").val();
	if (validateLogin()) {
		login(email, password)
			.then(success => {
				console.log(success);
				if (success.status === 200) {
					console.log(success);
					window.localStorage.setItem("token", success.json.token);
					window.localStorage.setItem("idCommensal", success.json.id);
					window.location = "/src/view/mainMenu.html";
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
