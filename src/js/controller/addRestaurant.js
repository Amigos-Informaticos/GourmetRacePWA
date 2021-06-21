$("#header").click(function(){
  console.log("Clicked");
  window.location = "mainMenu.html";
});

$("#restaurantForm").submit(function (event) {
	let name = $("#nameInput").val(),
		category = $("#categoryInput").val(),
		location = $("#locationInput").val(),
		serviceType = $("#serviceTypeInput").val(),
		price = $("input:radio[name=price]:checked").val(),
		idCommensal = localStorage.getItem("idCommensal");

	registerRestaurant(name, category, location, serviceType, price, idCommensal)
		.then((success) => {
			console.log(success);
			if (success.status === 201) {
				Swal.fire({
					icon: "success",
					title: "Restaurante registrado con exito",
				});
				window.location = "mainMenu.html";
			} else if (success.status === 400) {
				Swal.fire({
					icon: "warning",
					title: "Información del restaurante incompleta",
				});
			} else if (success.status === 409) {
				Swal.fire({
					icon: "warning",
					title: "El restaurante ya ha sido registrado previamente",
				});
			} else if (success.status === 419) {
				Swal.fire({
					icon: "info",
					title: "Sesión expirada",
					text: `Por favor, vuelva a iniciar sesión para continuar.`
				});
				window.location = "../..";
			} else {
				Swal.fire({
					icon: "error",
					title: "Fallo en la conexión",
					text: `Ocurrió un problema al comunicarse con el servidor. ${success.status}`
				});
			}
		})
		.catch((failure) => {
			Swal.fire({
				icon: "error",
				title: "Fallo al conectar con el servidor",
				text: `Por favor, verifique su conexión a internet. Status error: ${failure}`
			});
		});
	event.preventDefault();
});

async function registerRestaurant(name, category, location, serviceType, price, idCommensal) {
    const payload = {
      name: name, category:category, location:location, service_type: serviceType, price, registered_by:idCommensal
    }; 
    const connection = new Connection("https://amigosinformaticos.ddns.net:42066");
    Connection.token = localStorage.getItem("token");
    Connection.cookies = localStorage.getItem("cookie");
    const response = await connection.send("post", "restaurants", null, payload);	
	  return response;
}

async function loadCategories() {
	const $categorySelect = document.querySelector("#categoryInput"),
		$template = document.getElementById("template-category").content,
		$fragment = document.createDocumentFragment();

  const connection = new Connection("https://amigosinformaticos.ddns.net:42066");
  const response = await connection.send("get", "categories");
  const categories = response.json;

	categories.forEach(category => {
		$template.querySelector("option").value = category.id_category;
		$template.querySelector("option").textContent = category.category;
		let $clone = document.importNode($template, true);
		$fragment.appendChild($clone);
	})
	$categorySelect.appendChild($fragment);
}

async function loadServiceType() {
	const $serviceTypeSelect = document.querySelector("#serviceTypeInput"),
		$template = document.querySelector("#template-serviceType").content,
		$fragment = document.createDocumentFragment();

  const connection = new Connection("https://amigosinformaticos.ddns.net:42066");
  const response = await connection.send("get", "service_types");
  const services = response.json;

	services.forEach(service => {
		$template.querySelector("option").value = service.idServiceType;
		$template.querySelector("option").textContent = service.serviceType;
		let $clone = document.importNode($template, true);
		$fragment.appendChild($clone);
	})
	$serviceTypeSelect.appendChild($fragment);
}
document.addEventListener("DOMContentLoaded", function (event) {
    loadCategories();
    loadServiceType();
});