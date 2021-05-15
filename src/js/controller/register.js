$("#cancelButton").click(function () {
	loadContent("src/view/login.html");
});

$("#registerButton2").click(function () {

	console.log("click");
	if (validateRegister()) {
		Swal.fire({
			icon: 'success',
			title: 'Correcto'
		});
	} else {
		Swal.fire({
			icon: 'error',
			title: 'Campos incorrectos',
			text: 'Uno o más campos son incorrectos'
		});
	}
});

function validateRegister() {
	let commensal = new Commensal();
	let email = $("#emailInput");
	let password = $("#passwordInput");
	let username = $("#usernameInput");
	return commensal.isEmail(email) &&
		commensal.isPassword(password);
}
