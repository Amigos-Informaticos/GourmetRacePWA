var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides((slideIndex += n));
}

function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

function getSpanishWeekDay(dayNumber) {
  let dayName = "";
  switch (dayNumber) {
    case 1:
      dayName = "Lunes";
      break;
    case 2:
      dayName = "Martes";
      break;
    case 3:
      dayName = "Miercoles";
      break;
    case 4:
      dayName = "Jueves";
      break;
    case 5:
      dayName = "Viernes";
      break;
    case 6:
      dayName = "Sábado";
      break;
    case 7:
      dayName = "Domingo";
      break;
  }
  return dayName;
}

async function getCommensal() {
  let idCommensal = localStorage.getItem("idCommensal");
  Connection.token = localStorage.getItem("token");
  const connection = new Connection("https://amigosinformaticos.ddns.net:42066");
  const response = await connection.send("get", `commensals/${idCommensal}`);
  if(response.status === 200){
    document.getElementById("username-text").textContent = response.json.username;
  } else if (response.status === 419) {
    Swal.fire({
      icon: "warning",
      title: "Sesión caducada. Por favor, vuelva a iniciar sesión.",
      showConfirmButton: true,
      timer: 3000,
    }).then(swalPromise => {
      localStorage.clear();
      window.location = "../..";
    });
  }
}

function getRestaurant() {
  if (localStorage.getItem("idRestaurant")) {
    let idRestaurant = localStorage.getItem("idRestaurant"),
      $fragment = document.createDocumentFragment();
    const connection = new Connection(
      "https://amigosinformaticos.ddns.net:42066"
    );
    const response = connection.send("get", `restaurants/${idRestaurant}`);
    const $template = document.getElementById("template-image").content,
      $templateShedule = document.getElementById("template-shedule").content;

    response
      .then(function (result) {
        let $parent, $sibling;
        if (result.status === 200) {
          console.log(result);
          document.getElementById("restaurant-name").textContent =
              result.json.name;
          if (!result.json.claimed) {
            let $button = document.createElement("button");
            $button.setAttribute("id", "btnClaimRestaurant");
            $button.dataset.id_restaurant = result.json.id_restaurant;
            $button.textContent = "Reclamar";
            $parent = document.querySelector(".main-information");
            let $sibling = document.querySelector(".rating");
            $parent.insertBefore($button, $sibling);
          }
          if (result.json.claimer === Number.parseInt(localStorage.getItem("idCommensal"))) {
            let $button = document.createElement("button");
            $button.setAttribute("id", "btnViewsReport");
            $button.dataset.id_restaurant = result.json.id_restaurant;
            $button.textContent = "Ver reporte de vistas";
            $parent = document.querySelector(".main-information");
            let $sibling = document.querySelector(".rating");
            $parent.insertBefore($button, $sibling);
          }
          if (result.json.claimer === Number.parseInt(localStorage.getItem("idCommensal"))) {
            let $button = document.createElement("button");
            $button.setAttribute("id", "btnScoreReport");
            $button.dataset.id_restaurant = result.json.id_restaurant;
            $button.textContent = "Ver reporte de puntuaciones";
            $parent = document.querySelector(".main-information");
            let $sibling = document.querySelector(".rating");
            $parent.insertBefore($button, $sibling);
          }
          document.getElementById("restaurant-categorie").textContent =
              result.json.category;
          document
              .getElementById("restaurant-location")
              .setAttribute("href", result.json.location);
          document
              .getElementById("restaurant-location")
              .setAttribute("target", "_blank");
          document.querySelector(".rating").dataset.id_restaurant =
              result.json.id_restaurant;
          document.querySelector(".rating").dataset.score = result.json.score;
          activeStars();

          if (result.json.images.length > 0) {
            result.json.images.forEach((image) => {
              $template.querySelector("img").setAttribute("src", image);
              $template.querySelector(".numbertext").textContent = `${
                  result.json.images.indexOf(image) + 1
              }/${result.json.images.length}`;
              let $clone = document.importNode($template, true);
              $fragment.appendChild($clone);
            });
            document
                .querySelector(".slideshow-container")
                .appendChild($fragment);
          } else {
            $template
                .querySelector("img")
                .setAttribute("src", "/images/restaurant-default.jpg");
          }
          $fragment = document.createDocumentFragment();

          result.json.schedules.forEach((day) => {
            $templateShedule.querySelector("th").textContent =
                getSpanishWeekDay(day.day);
            $templateShedule.querySelector(
                "td"
            ).textContent = `${day.startTime} - ${day.endTime}`;
            let $clone = document.importNode($templateShedule, true);
            $fragment.appendChild($clone);
          });

          for (let i = 0; i < result.json.price; i++) {
            let $icon = document.createElement("i");
            $icon.setAttribute("class", "fas fa-dollar-sign");
            document.querySelector("#restaurant-price").appendChild($icon);
          }

          result.json.serviceTypes.forEach((service) => {
            let $span = document.createElement("span");
            $span.setAttribute("class", "serviceType");
            $span.textContent = service;
            document.querySelector(".serviceType-container").appendChild($span);
          });
          document.querySelector(".schedule").appendChild($fragment);
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Fallo en la conexión",
          text: `Ocurrió un problema al comunicarse con el servidor.`,
        }).then((window.location = "mainMenu.html"));
      });
  } else {
    window.location = "mainMenu.html";
  }
}

function activeStars() {
  const $ratings = document.getElementsByClassName("rating");
  for ($rating of $ratings) {
    let rounded = Math.round(($rating.dataset.score * 5) / 10);
    if (rounded > 5) {
      rounded = 5;
    }
    for (let i = 0; i < rounded; i++) {
      $rating.children[i].className = "rating__star fas fa-star";
    }
  }
}

function getComments() {
  if (localStorage.getItem("idRestaurant")) {
    let idRestaurant = localStorage.getItem("idRestaurant"),
      $fragment = document.createDocumentFragment(),
      idCommensal = localStorage.getItem("idCommensal");
    const $template = document.getElementById("template-comment-box").content;
    const connection = new Connection(
      "https://amigosinformaticos.ddns.net:42066"
    );
    const response = connection.send(
      "get",
      `restaurants/${idRestaurant}/comments`
    );
    response
      .then((success) => {
        console.log(success);
        if (success.status === 200) {
          const comments = success.json;
          comments.forEach((comment) => {
            $template.querySelector(".comment-box").dataset.id_comment =
              comment.comment_id;
            $template
              .querySelector(".comment-box")
              .setAttribute("id", comment.comment_id);
            $template.querySelector(".comment-username").textContent =
              comment.username;
            $template.querySelector(".comment-username").dataset.id_commensal =
              comment.commensal_id;
            let date = new Date(comment.date);
            date.setDate(date.getDate() + 1);
            $template.querySelector(".comment-date").textContent =
              date.toLocaleDateString("es-US");
            $template.querySelector(".comment-text").textContent =
              comment.comment;
            if (comment.commensal_id === Number.parseInt(idCommensal)) {
              $template.querySelector(".comment-delete-icon").style.display =
                "block";
              $template.querySelector(
                ".comment-delete-icon"
              ).dataset.id_comment = comment.comment_id;
            }
            let $clone = document.importNode($template, true);
            $fragment.appendChild($clone);
          });
          document.querySelector(".comments-container").appendChild($fragment);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    window.location = "mainMenu.js";
  }
}

function deleteRestaurant(e) {
    console.log(e.target.dataset.id_restaurant);
    let idRestaurant = e.target.dataset.id_restaurant,
      idCommensal = localStorage.getItem("idCommensal");
    const headers = {
      id_commensal: idCommensal,
    };
    console.log(e.target);
    $parenteElement = document.querySelector(".comments-container");
  
    const connection = new Connection("https://amigosinformaticos.ddns.net:42066");
    connection.setHeaders(headers);
    Connection.token = localStorage.getItem("token");
    Connection.cookies = localStorage.getItem("cookie");
  
    const response = connection.send(
      "delete",
      `restaurants/${idRestaurant}/comments/${idComment}`
    );
  
    response
      .then((success) => {
        console.log(success);
        if (success.status == 200) {
          $parenteElement.removeChild(
            document.getElementById(e.target.dataset.id_comment)
          );
        } else if (success.status == 409) {
          Swal.fire({
            icon: "warning",
            title: "No puede eliminar comentarios de otros usuarios",
            text: `Solo puede eliminar los propios.`,
          });
        } else if (success.status >= 400 && success.status < 500) {
          Swal.fire({
            icon: "error",
            title: "Error en la solicitud",
            text: "Ha ocurrido un error en la solicitud con el servidor. Por favor, vuelva a intentarlo más tarde.",
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error en la solicitud",
          text: "Ha ocurrido un error en la solicitud con el servidor. Por favor, vuelva a intentarlo más tarde.",
        });
        console.log("error");
      });
    e.stopPropagation();
  }

function deleteComment(e) {
  console.log(e.target.dataset.id_comment);
  let idComment = e.target.dataset.id_comment,
    idRestaurant = localStorage.getItem("idRestaurant"),
    idCommensal = localStorage.getItem("idCommensal");
  const headers = {
    id_commensal: idCommensal,
  };
  console.log(e.target);
  $parenteElement = document.querySelector(".comments-container");

  const connection = new Connection("https://amigosinformaticos.ddns.net:42066");
  connection.setHeaders(headers);
  Connection.token = localStorage.getItem("token");
  Connection.cookies = localStorage.getItem("cookie");

  const response = connection.send(
    "delete",
    `restaurants/${idRestaurant}/comments/${idComment}`
  );

  response
    .then((success) => {
      console.log(success);
      if (success.status == 200) {
        $parenteElement.removeChild(
          document.getElementById(e.target.dataset.id_comment)
        );
      } else if (success.status == 409) {
        Swal.fire({
          icon: "warning",
          title: "No puede eliminar comentarios de otros usuarios",
          text: `Solo puede eliminar los propios.`,
        });
      } else if (success.status >= 400 && success.status < 500) {
        Swal.fire({
          icon: "error",
          title: "Error en la solicitud",
          text: "Ha ocurrido un error en la solicitud con el servidor. Por favor, vuelva a intentarlo más tarde.",
        });
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Error en la solicitud",
        text: "Ha ocurrido un error en la solicitud con el servidor. Por favor, vuelva a intentarlo más tarde.",
      });
      console.log("error");
    });
  e.stopPropagation();
}

async function rateRestaurant(e) {
  const starClassActive = "rate_star fas fa-star";
  const starClassInactive = "rate_star far fa-star";
  let rateValue = 0,
    i = 0;
  let ratingStars = [...document.getElementsByClassName("rate_star")].reverse();
  while (i < ratingStars.length) {
    if (ratingStars[i].className == starClassActive) {
      rateValue = Number.parseInt(ratingStars[i].dataset.value);
      break;
    }
    i++;
  }
  rateValue = (rateValue * 10) / 5;
  if (rateValue > 0) {
    const connection = new Connection(
      "https://amigosinformaticos.ddns.net:42066"
    );
    Connection.token = localStorage.getItem("token");
    Connection.cookies = localStorage.getItem("cookie");
    let idRestaurant = localStorage.getItem("idRestaurant");
    let idCommensal = localStorage.getItem("idCommensal");
    let currentDate = new Date();
    currentDate =
      currentDate.getFullYear() +
      "/" +
      (currentDate.getMonth() + 1) +
      "/" +
      currentDate.getDate();

    const params = {
      score: rateValue,
      id_commensal: idCommensal,
      date: currentDate,
    };
    const response = connection.send(
      "post",
      `restaurants/${idRestaurant}/scores`,
      null,
      params
    );
    response
      .then((success) => {
        if (success.status == 201) {
          Swal.fire({
            icon: "success",
            title: "Calificación exitosa",
            text: "La calificación ha sido guardada con exito",
          });
        } else if (success.status == 419) {
          Swal.fire({
            icon: "warning",
            title: "Sesión caducada",
            text: "Su sesión ha caducado, por favor vuelva a iniciar sesión",
          }).then(()=> {
            localStorage.clear();
            window.location = "../.."
          });
        } else if (success.status >= 400 && success.status < 500) {
          Swal.fire({
            icon: "error",
            title: "Error en la solicitud",
            text: "Ha ocurrido un error en la solicitud con el servidor. Por favor, vuelva a intentarlo más tarde.",
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Ocurrió un error al comunicarse con el servidor",
          text: `Error: ${error}`,
        });
        window.location = "../..";
      });
  }
}

async function commentRestaurant(payload) {
  const connection = new Connection("https://amigosinformaticos.ddns.net:42066");
  Connection.token = localStorage.getItem("token");
  Connection.cookies = localStorage.getItem("cookie");
  let idRestaurant = localStorage.getItem("idRestaurant");
  const response = await connection.send(
    "post",
    `restaurants/${idRestaurant}/comments`,
    null,
    payload
  );
  return response;
}

function validateCommentForm(comment, idCommensal) {
  let isValid = false;
  if (comment && idCommensal) {
    isValid = true;
  }
  return isValid;
}

$("#restaurant-shedule").click(function () {
  $(".schedule").toggleClass("hide");
});

$("#comment-form").submit(function () {
  Connection.token = localStorage.getItem("token");
  let idCommensal = localStorage.getItem("idCommensal");
  let comment = $("#txtComment").val();
  let currentDate = new Date();
  currentDate =
    currentDate.getFullYear() +
    "/" +
    (currentDate.getMonth() + 1) +
    "/" +
    currentDate.getDate();
  const payload = {
    id_commensal: idCommensal,
    comment: comment,
    date: currentDate,
  };
  if (validateCommentForm(comment, idCommensal)) {
    if (localStorage.getItem("idRestaurant")) {
      commentRestaurant(payload)
        .then(response => {
          console.log(response);
          if (response.status === 201) {
            Swal.fire({
              icon: "success",
              title: "Comentario guardado con exito",
              showConfirmButton: false,
              timer: 3000,
            });
            let $templateCommentBox = document.getElementById("template-comment-box").content;
            $templateCommentBox.querySelector(".comment-box").setAttribute("id", response.json.comment_id);
            $templateCommentBox.querySelector(".comment-box").dataset.comment_id = response.json.comment_id;
            $templateCommentBox.querySelector(".comment-delete-button").dataset.comment_id = response.json.comment_id;
            $templateCommentBox.querySelector(".comment-username").textContent = response.json.username;
            $templateCommentBox.querySelector(".comment-username").dataset.id_commensal =
                comment.commensal_id;
            let date = new Date(comment.date);
            date.setDate(date.getDate() + 1);
            $templateCommentBox.querySelector(".comment-date").textContent = date.toLocaleDateString("es-US");
            $templateCommentBox.querySelector(".comment-text").textContent = response.json.comment;
            const $commentBox = document.importNode($templateCommentBox, true);
            const $commentsContainer = document.querySelector(".comments-container");
            $commentsContainer.appendChild($commentBox);
          } else if (response.status === 419) {
            Swal.fire({
              icon: "warning",
              title: "Sesión caducada. Por favor, vuelva a iniciar sesión."
            }).then(() => {
              localStorage.clear();
              window.location = "../..";
            });
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Fallo en la conexión",
            text: `Ocurrió un problema al comunicarse con el servidor.`,
          });
          console.log(error);
        });
    } else {
      window.location = "mainMenu.html";
    }
  } else {
    Swal.fire({
      icon: "warning",
      title: "Comentario incompleto",
      showConfirmButton: true,
    });
  }
});

function executeRating(stars) {
  const starClassActive = "rate_star fas fa-star";
  const starClassInactive = "rate_star far fa-star";
  const starsLength = stars.length;
  let i;
  stars.map((star) => {
    star.onclick = () => {
      i = stars.indexOf(star);

      if (star.className === starClassInactive) {
        for (i; i >= 0; --i) stars[i].className = starClassActive;
      } else {
        for (i; i < starsLength; ++i) stars[i].className = starClassInactive;
      }
    };
  });
}

function claimRestaurant(event) {
  const connection = new Connection("https://amigosinformaticos.ddns.net:42066");
  Connection.token = localStorage.getItem("token");
  let idRestaurant = document.querySelector("#btnClaimRestaurant").dataset
    .id_restaurant;
  let idCommensal = localStorage.getItem("idCommensal");

  const payload = {
    restaurant_id: idRestaurant,
  };

  const response = connection.send(
    "post",
    `commensals/${idCommensal}/claims`,
    null
  );

  Swal.fire({
    icon: "question",
    title: "¿Está seguro que desea reclamar el retaurante?",
    showConfirmButton: true,
    showDenyButton: true,
    confirmButtonText: "Sí",
    denyButtonText: "No",
    reverseButtons: true,
  }).then((swalPromise) => {
    if (swalPromise.isConfirmed) {
      response
        .then((success) => {
          if (success.status == 200) {
            Swal.fire({
              icon: "success",
              title: "Restaurante reclamado con exito",
            });
            Connection.token = success.token;
          } else if (success.status == 401 || success.status == 419) {
            Swal.fire({
              icon: "warning",
              title: "Sesión caducada. Por favor, vuelva a iniciar sesión.",
              showConfirmButton: true,
              timer: 5000,
            }).then(() => {
              localStorage.clear();
              window.location = "../..";
            });
          } else if (success.status >= 400 && success.status < 500) {
            Swal.fire({
              icon: "error",
              title: "Ocurrió un error en la comunicación con el servidor.",
              showConfirmButton: true,
              timer: 5000,
              timerProgressBar: true,
            });
          }
        })
        .catch(
          Swal.fire({
            icon: "error",
            title: "Ocurrio un error en la comunicación con el servidor",
            showConfirmButton: true,
            timer: 5000,
            timerProgressBar: true,
          })
        );
    }
  });
}

async function uploadImage(e) {
  const { value: file } = await Swal.fire({
    title: "Seleccione una imagen",
    input: "file",
    inputAttributes: {
      accept: "image/*",
      "aria-label": "Upload your profile picture",
    },
  });
  if (file) {
    if (file.size < 5000000) {
      let idRestaurant = localStorage.getItem("idRestaurant"),
        idCommensal = localStorage.getItem("idCommensal");
      let payload = {
        commensal_id: idCommensal,
        file,
      };

      let connection = new Connection(
        "https://amigosinformaticos.ddns.net:42066"
      );
      Connection.token = localStorage.getItem("token");
      const response = connection.send(
        "post",
        `restaurants/${idRestaurant}/images`,
        null,
        payload,
        true
      );
      response.then((success) => {
        if (success.status === 202) {
          const reader = new FileReader();
          reader.onload = (e) => {
            Swal.fire({
              title: "La imagen que has subido",
              imageUrl: e.target.result,
              imageAlt: "La imagen que has subido",
            });
          };
          reader.readAsDataURL(file);
        } else if (success.status === 401 || success.status === 419) {
          Swal.fire({
            icon: "warning",
            title: "Sesión caducada. Por favor, vuelva a iniciar sesión.",
            showConfirmButton: true,
            timer: 3000,
          }).then(() => {
            localStorage.clear();
            window.location = "../..";
          });
        }
        console.log(success);
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Archivo demasiado grande",
        text: `Introduzca una imagen con un tamaño menor a 5 MB.`,
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", function (event) {
  let ratingStars = [...document.getElementsByClassName("rate_star")];
  executeRating(ratingStars);
  getRestaurant();
  getComments();
  getCommensal();
});

document.addEventListener("click", async (e) => {
  if (e.target.matches(".comment-delete-icon")) {
    deleteComment(e);
  } else if (e.target.matches("#btnRateRestaurant")) {
    rateRestaurant(e);
  } else if (e.target.matches("#btnClaimRestaurant")) {
    claimRestaurant(e);
  } else if (e.target.matches("#btnEditRestaurant")) {
    window.location = "editRestaurant.html";
  } else if (e.target.matches("#btnViewsReport")) {
    window.location = "viewsReport.html";
  } else if (e.target.matches("#btnScoreReport")) {
    window.location = "scoreReport.html";
  } else if (e.target.matches("#gourmet-race")) {
    window.location = "mainMenu.html";
  } else if (e.target.matches("#btnAddImage")) {
    uploadImage(e);
  }
});
