import {Commensal} from "./model/commensal.js";
const Swal = require("sweetalert.js");

$("#registerButton").click(function () {
	loadContent("src/view/register.html");
	savePage();
});

$("#loginButton").click(function () {
	console.log("Click login");
	if (validateLogin()) {
		console.log("Correcto");
		Swal.fire({
			icon: 'success',
			title: 'Correcto',
			text: ''
		})
	} else {
		console.log("incorrecto");
		Swal.fire({
			icon: 'error',
			title: 'Campos vacíos',
			text: 'Uno o más campos se encuentran vacíos'
		});
	}
});

function validateLogin() {
	let commensal = new Commensal();
	let email = $("#emailInput").val();
	let password = $("#passwordInput").val();
	return commensal.isEmail(email) && commensal.isPassword(password);
}

function login() {

}