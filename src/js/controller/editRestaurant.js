async function loadCategories() {
  const $categorySelect = document.querySelector("#categoryInput"),
    $template = document.getElementById("template-category").content,
    $fragment = document.createDocumentFragment();

  const connection = new Connection("https://amigosinformaticos.ddns.net:42066");
  const response = await connection.send("get", "categories");
  const categories = response.json;

  categories.forEach((category) => {
    $template.querySelector("option").value = category.id_category;
    $template.querySelector("option").textContent = category.category;
    let $clone = document.importNode($template, true);
    $fragment.appendChild($clone);
  });
  $categorySelect.appendChild($fragment);
}

async function loadServiceType() {
  const $serviceTypeSelect = document.querySelector("#serviceTypeInput"),
    $template = document.querySelector("#template-serviceType").content,
    $fragment = document.createDocumentFragment();

  const connection = new Connection("https://amigosinformaticos.ddns.net:42066");
  const response = await connection.send("get", "service_types");
  const services = response.json;

  services.forEach((service) => {
    $template.querySelector("option").value = service.idServiceType;
    $template.querySelector("option").textContent = service.serviceType;
    let $clone = document.importNode($template, true);
    $fragment.appendChild($clone);
  });
  $serviceTypeSelect.appendChild($fragment);
}

function getRestaurant() {
  if (localStorage.getItem("idRestaurant")) {
    let idRestaurant = localStorage.getItem("idRestaurant"),
      idCommensal = localStorage.getItem("idCommensal"),
      $btnEditRestaurant = document.getElementById("btnEditRestaurant"),
      $fragment = document.createDocumentFragment();
    const connection = new Connection(
      "https://amigosinformaticos.ddns.net:42066"
    );
    const response = connection.send("get", `restaurants/${idRestaurant}`);

    response
      .then(function (result) {
        if (result.status == 200) {
          document.getElementById("nameInput").value = result.json.name;
          document.getElementById("locationInput").value = result.json.location;

          if (result.json.claimer == idCommensal) {
            let $button = document.createElement("button");
            $button.setAttribute("id", "btnDisableRestaurant");
            $button.dataset.id_restaurant = result.json.id_restaurant;
            $button.textContent = "Dar de baja";
            $parent = document.querySelector(".button-section");
            $sibling = document.querySelector("#btnEditRestaurant");
            $parent.insertBefore($button, $sibling);
          }

          $btnEditRestaurant.dataset.name = result.json.name;
          $btnEditRestaurant.dataset.location = result.json.location;
          $btnEditRestaurant.dataset.id_restaurant = result.json.id_restaurant;
          $btnEditRestaurant.dataset.id_category = result.json.idCategory;
          $btnEditRestaurant.dataset.price = result.json.price;
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Fallo en la conexión",
          text: `Ocurrió un problema al comunicarse con el servidor.`,
        }).then((window.location = "/src/view/mainMenu.html"));
        console.log(error);
      });
  } else {
    window.location = "/src/view/mainMenu.html";
  }
}

async function editRestaurant(e) {
  let d = document;
  let name = d.getElementById("nameInput").value,
    category = d.getElementById("categoryInput").value,
    location = d.getElementById("locationInput").value,
    price = $("input:radio[name=price]:checked").val();
  const payload = {
    name,
    category,
    location,
    price,
  };
  const connection = new Connection("https://amigosinformaticos.ddns.net:42066");
  Connection.token = localStorage.getItem("token");
  console.log(payload);
  const response = connection.send(
    "post",
    `restaurants/${localStorage.getItem("idRestaurant")}`,
    null,
    payload
  );
  response
    .then((success) => {
      if (success.status == 200) {
        Swal.fire({
          icon: "success",
          title: "Restaurante modificado con exito",
          text: `El restaurante se ha modificado exito.`,
        });
      } else if (success.status == 401 || success.status == 419) {
        Swal.fire({
          icon: "warning",
          title: "Sesión caducada",
          text: "Su sesión ha caducado, por favor vuelva a iniciar sesión",
        }).then((window.location = "/"));
      }
      console.log(success);
    })
    .catch((error) => {
      console.log(error);
    });
}

document.addEventListener("DOMContentLoaded", function (event) {
  getRestaurant();
  loadCategories();
  loadServiceType();
});

document.addEventListener("click", async (e) => {
  if (e.target.matches("#btnEditRestaurant")) {
    editRestaurant(e);
  } else if (e.target.matches(".header h1")) {
    window.location = "/src/view/mainMenu.html";
  } else if(e.target.matches("#btnCancel")){
    window.location = "/src/view/restaurantInfo.html";

  }
  console.log("Elemento clickeado", e.target);
});
