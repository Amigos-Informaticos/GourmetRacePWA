function getRestaurant() {
  if (localStorage.getItem("idRestaurant")) {
    let idRestaurant = localStorage.getItem("idRestaurant");
    const connection = new Connection(
      "http://amigosinformaticos.ddns.net:42066"
    );
    const response = connection.send("get", `restaurants/${idRestaurant}`);
    console.log(response);
    response
      .then(function (result) {
        if (result.status == 200) {
          console.log(result);
          document.getElementById("report-title").textContent =
            `Reporte de vistas del restaurante: ${result.json.name}`;
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

async function getViews() {
  const connection = new Connection("http://amigosinformaticos.ddns.net:42066");
  let idRestaurant = localStorage.getItem("idRestaurant");
  let headers = {
    id_commensal: localStorage.getItem("idCommensal"),
  };
  Connection.token = localStorage.getItem("token");
  connection.setHeaders(headers);
  let response = connection.send("get", `restaurants/${idRestaurant}/views`);

  console.log(response);
  let myChart = document.getElementById("myChart").getContext("2d");
  const dateArray = [];
  const viewsArray = [];

  response
    .then((success) => {
      if (success.status == 200) {
        document.getElementById("view-number").textContent = `Cantidad total de vistas: ${success.json.views.length}`;
        success.json.views.forEach((date) => {
          dateArray.push(date.date);
          viewsArray.push(date.views);
        });
        console.log("Date array", dateArray);
        let viewsChart = new Chart(myChart, {
          type: "line",
          data: {
            labels: dateArray.reverse(),
            datasets: [
              {
                label: "Número de vistas",
                data: viewsArray.reverse(),
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                  "rgba(255, 159, 64, 0.2)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1,
                hoverBorderWidth: 1.5,
              },
            ],
          },
          options: {
            title: {
              display: true,
              text: "Reporte de vistas en los últimos 7 días",
              fontSize: 25,
            },
            legend: {
              position: "right",
              labels: {
                fontColor: "#000",
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      } else if (success.status == 419) {
        Swal.fire({
          icon: "warning",
          title: "Su sesión ha caducado. Por favor vuelva a iniciar sesión",
          text: `Ocurrió un problema al comunicarse con el servidor.`,
        }).then(() => {
          localStorage.clear();
          window.location = "/";
        });
      }
    })
    .catch((err) => {
      Swal.fire({
        icon: "error",
        title: "Error de red",
        text: `Ocurrió un problema al comunicarse con el servidor. Verifique su conexión`,
      });
    });
}
getRestaurant();
getViews();

document.addEventListener("click", e => {
  if(e.target.matches(".header h1")){
    window.location = "/src/view/mainMenu.html";
  }
})