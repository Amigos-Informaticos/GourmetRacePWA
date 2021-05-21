$("#registerButton").click(function () {
	loadContent("src/view/register.html");
});

$("#loginButton").click(function () {
	console.log("Loga");
	if (validateLogin()) {
		Swal.fire({
			icon: 'success',
			title: 'Correcto',
			text: ''
		});
	} else {
		Swal.fire({
			icon: 'error',
			title: 'Campos incorrectos',
			text: 'Uno o más campos son incorrectos'
		});
	}
});

async function respuesta(){
	const connection = new Connection("http://amigosinformaticos.ddns.net:42066");
	const _respuesta = await connection.send("post","commensals",null,null);
	console.log(_respuesta);
} 

function validateLogin() {
	let commensal = new Commensal();
	let email = $("#emailInput").val();
	let password = $("#passwordInput").val();
	return commensal.isEmail(email) && commensal.isPassword(password);
}
