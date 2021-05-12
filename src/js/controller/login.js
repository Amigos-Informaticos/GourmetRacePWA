$("#registerButton").click(function () {
	loadContent("src/view/register.html");
});

$("#loginButton").click(function () {
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

function validateLogin() {
	let commensal = new Commensal();
	let email = $("#emailInput").val();
	let password = $("#passwordInput").val();
	return commensal.isEmail(email) && commensal.isPassword(password);
}
