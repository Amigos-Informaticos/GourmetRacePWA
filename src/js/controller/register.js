$("#cancelButton").click(function () {
	window.location = "/";
});

document.querySelector("#registerForm").onsubmit = function (){	
	let email = $("#emailInput").val(),
	password = $("#passwordInput").val(),
	username = $("#usernameInput").val();
	
	if (validateRegister()) {
		register(email, password, username).then(success => {			
			if(success.status === 201) {
				Swal.fire({
					icon: 'success',
					title: 'Comensal registrado con exito'					
				});				
			} else if (success.status === 409) {
				Swal.fire({
					icon: 'warning',
					title: 'El comensal ya ha sido registrado previamente'				
				});
			}
		}).catch(failure => {
			Swal.fire({
				icon: 'error',
				title: 'Fallo al conectar con el servidor'				
			});
		});
		return false;		
	} else {
		Swal.fire({
			icon: 'warning',
			title: 'Campos incorrectos',
			text: 'Uno o más campos son incorrectos'
		});		
	}
};

function validateRegister() {
	let email = $("#emailInput").val();
	let password = $("#passwordInput").val();
	let username = $("#usernameInput").val();
	let commensal = new Commensal();
	return commensal.isEmail(email) &&
		commensal.isPassword(password);
}

async function register(email, password, username) {
	const payload = {email, password, username};
	const connection = new Connection("http://amigosinformaticos.ddns.net:42066");
	const response = await connection.send("post", "commensals", null, payload);	
	return response;
	
}
