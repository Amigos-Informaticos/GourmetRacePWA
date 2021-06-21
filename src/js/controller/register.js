$("#cancelButton").click(function () {
	window.location = "../../index.html";
});

document.querySelector("#registerForm").onsubmit = function (e){	
	let email = $("#emailInput").val(),
	password = $("#passwordInput").val(),
	username = $("#usernameInput").val();
	e.preventDefault();
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
			} else if (success.status>=400 && success < 500) {
				Swal.fire({
					icon: 'error',
					title: 'Fallo al conectar con el servidor',
					text: `Ocurrió un error en la comunicación con el servidor. 
					Código de error: ${success.status}`
				});				
			}else if(success.status === 500){
				Swal.fire({
					icon: 'error',
					title: 'Fallo al conectar con el servidor',
					text:`Código de error: ${success.status}`
				});
			}
		}).catch(failure => {
			Swal.fire({
				icon: 'error',
				title: 'Fallo al conectar con el servidor'				
			});
		});		
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
	const connection = new Connection("https://amigosinformaticos.ddns.net:42066");
	const response = await connection.send("post", "commensals", null, payload);	
	return response;
	
}
