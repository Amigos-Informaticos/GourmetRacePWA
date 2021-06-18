$("#cancelButton").click(function () {
	window.location = "/";
});

document.querySelector("#registerForm").onsubmit = function (e){	
	let email = $("#emailInput").val(),
	password = $("#passwordInput").val(),
	username = $("#usernameInput").val();
	e.preventDefault();
	if (validateRegister()) {
		register(email, password, username).then(success => {
            console.log(success);
			if(success.status === 200) {
				Swal.fire({
					icon: 'success',
					title: 'Comensal modificado con exito'					
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
    let idCommensal = localStorage.getItem("idCommensal");
	const payload = {id:idCommensal, password, username};
	const connection = new Connection("http://amigosinformaticos.ddns.net:42066");
	const response = await connection.send("post", `commensals/${idCommensal}`, null, payload);	
	return response;
	
}
