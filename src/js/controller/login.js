async function login(email, password) {
	const payload = {email, password};
	const connection = new Connection("https://amigosinformaticos.ddns.net:42066");
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
	let email = $("#emailInput").val();
	let password = $("#passwordInput").val();
	if (validateLogin()) {
		login(email, password)
			.then(success => {
				console.log(success);
				if (success.status === 200) {					
					window.localStorage.setItem("token", success.json.token);
					window.localStorage.setItem("idCommensal", success.json.id);
					window.localStorage.setItem("cookie", Connection.cookies);
					window.location = "./src/view/mainMenu.html";
				} else if(success.status === 406){					
					Swal.fire({
						icon: "warning",
						title: "Información incorrecta o malformada",
						text: `Verique que los campos sean correctos`
					})
				} else if(success.status === 404){
					Swal.fire({
						icon: "info",
						title: "Usuario no registrado",
						text: `No existe un usuario con las credenciales indicadas`
					})

				} else if(success.status >= 400 && success.status< 500){
					Swal.fire({
						icon: "error",
						title: "Error en la petición",
						text: `Ocurrió un problema al comunicarse con el servidor. Verifique su conexión`
					})
				}
			}).catch(() => {
				Swal.fire({
					icon: "error",
					title: "Error de red",
					text: `Ocurrió un problema al comunicarse con el servidor. Verifique su conexión`
				})
			});
	} else {
		Swal.fire({
			icon: 'error',
			title: 'Campos incorrectos',
			text: 'Uno o más campos son incorrectos'
		});
	}
});
