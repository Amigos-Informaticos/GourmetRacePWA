$("#registerButton").click(function () {
	loadContent("src/view/register.html");
	savePage();
});

$("#loginButton").click(function () {
	if (validateLogin()) {

	} else {
		Swal.fire({
			icon: 'error',
			title: 'Campos vacíos',
			text: 'Uno o más campos se encuentran vacíos'
		});
	}
});

function validateLogin() {
	let email = $("#emailInput").val();
	let password = $("#passwordInput").val();
	return email !== "" && password !== "";
}

function login() {

}