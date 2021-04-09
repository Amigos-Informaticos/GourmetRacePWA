$("#registerButton").click(function () {
	loadContent("src/view/register.html");
	savePage();
});

$("#loginButton").click(function () {
	if ($("#emailInput").val() === "" ||
		$("#passwordInput").val() === "") {
		Swal.fire({
			icon: 'error',
			title: 'Campos vacíos',
			text: 'Uno o más campos se encuentran vacíos'
		});
	} else {
		Swal.fire({
			icon: 'success',
			title: 'Correcto!'
		});
	}
});