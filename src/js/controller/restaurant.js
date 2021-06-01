$("#restaurantForm").submit(function (event) {    
  let name = $("#nameInput").val(),
    category = $("#categoryInput").val(),
    location = $("#locationInput").val(),
    price = $("input:radio[name=price]:checked").val(),
    idCommensal = localStorage.getItem("idCommensal");

  registerRestaurant(name, category, location, idCommensal)
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

async function registerRestaurant(name, category, location, idCommensal) {
    const payload = {
      name: name, idCategory:category, location:location, registeredBy:idCommensal
    }; 
    const connection = new Connection("http://amigosinformaticos.ddns.net:42066");
    Connection.token = localStorage.getItem("token");
    Connection.cookies = localStorage.getItem("cookie");
    const response = await connection.send("post", "restaurants", null, payload);	
	  return response;
}