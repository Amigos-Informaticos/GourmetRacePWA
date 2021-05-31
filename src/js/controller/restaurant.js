const Connection = require("../connection/connection");

$("#restaurantForm").submit(function (event) {
    console.log("Hola");
  let name = $("#nameInput").val(),
    category = $("#categoryInput").val(),
    location = $("#locationInput").val(),
    price = $("input:radio[name=price]:checked").val(),
    token = localStorage.getItem("token"),
    idCommensal = localStorage.getItem("idCommensal");

  registerRestaurant(name, category, location, price, idCommensal, token)
    .then((success) => {
      if (success.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Comensal registrado con exito",
        });
      } else if (success.status === 409) {
        Swal.fire({
          icon: "warning",
          title: "El comensal ya ha sido registrado previamente",
        });
      }
    })
    .catch((failure) => {
      Swal.fire({
        icon: "error",
        title: "Fallo al conectar con el servidor",
      });
    });
  event.preventDefault();
});

async function registerRestaurant(name, category, location, idCommensal, token) {
    const payload = {name, idCategory:category, location, registeredBy:idCommensal},    
    const connection = new Connection("http://amigosinformaticos.ddns.net:42066");
    Connection.token = token;
    const response = await connection.send("post", "restaurants", null, payload);	
	return response;
}