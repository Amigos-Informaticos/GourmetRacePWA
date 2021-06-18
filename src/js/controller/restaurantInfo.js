var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("dot");
    if (n > slides.length) {
        slideIndex = 1
    }
    if (n < 1) {
        slideIndex = slides.length
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
            break
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

function getRestaurant() {
    let idRestaurant = 5,
        $fragment = document.createDocumentFragment();
    const connection = new Connection("http://amigosinformaticos.ddns.net:42066");
    const response = connection.send("get", `restaurants/${idRestaurant}`);
    const $template = document.getElementById("template-image").content,
        $templateShedule = document.getElementById("template-shedule").content;


    response.then(function (result) {
        document.getElementById("restaurant-name").textContent = result.json.name;
        document.getElementById("restaurant-price").textContent = result.json.price;
        document.getElementById("restaurant-categorie").textContent = result.json.category;
        document.getElementById("restaurant-location").setAttribute("href", result.json.location);
        document.getElementById("restaurant-location").setAttribute("target", "_blank");

        result.json.images.forEach(image => {
            $template.querySelector("img").setAttribute("src", image);
            $template.querySelector(".numbertext").textContent = `${result.json.images.indexOf(image) + 1}/${result.json.images.length}`;
            let $clone = document.importNode($template, true);
            $fragment.appendChild($clone);
        });
        document.querySelector(".slideshow-container").appendChild($fragment);

        $fragment = document.createDocumentFragment();

        result.json.schedules.forEach(day => {
                $templateShedule.querySelector("th").textContent = getSpanishWeekDay(day.day);
                $templateShedule.querySelector("td").textContent = `${day.startTime} - ${day.endTime}`;
                let $clone = document.importNode($templateShedule, true);
                $fragment.appendChild($clone);
            }
        );
        document.querySelector(".schedule").appendChild($fragment);
    }).catch(error => {
        Swal.fire({
            icon: "error",
            title: "Fallo en la conexión",
            text: `Ocurrió un problema al comunicarse con el servidor.`
        });//.then(window.location = "/src/view/mainMenu.html");
    });
}

function deleteComment(e) {
    console.log(e.target.dataset.id_comment);
    let idComment = e.target.dataset.id_comment,
        idRestaurant = "5",//localStorage.getItem("idRestaurant")
        idCommensal = localStorage.getItem("idCommensal");

    const connection = new Connection("http://amigosinformaticos.ddns.net:42066");
    Connection.token = localStorage.getItem("token");
    Connection.cookies = localStorage.getItem("cookie");
    const payload = {
        id_commensal: idCommensal
    }
    const response = connection.send("delete", `restaurants/${idRestaurant}/comments/${idComment}`, null, payload);

    response.then(success => {
        console.log(success.json);

    }).catch(
        console.log("error")
    );


    e.stopPropagation();

}

function getComments() {
    let idRestaurant = 5,
        $fragment = document.createDocumentFragment(),
    idCommensal = localStorage.getItem("idCommensal");
    const connection = new Connection("http://amigosinformaticos.ddns.net:42066");
    const response = connection.send("get", `restaurants/${idRestaurant}/comments`);

    const $template = document.getElementById("template-comment-box").content;

    response.then(success => {
        console.log(success);
        if (success.status == 200) {
            const comments = success.json;
            console.log(comments);
            comments.forEach(comment => {
                $template.querySelector(".comment-box").dataset.id_comment = comment.comment_id;
                $template.querySelector(".comment-username").textContent = comment.username;
                $template.querySelector(".comment-username").dataset.id_commensal = comment.commensal_id;
                let date = new Date(comment.date);
                date.setDate(date.getDate() + 1);
                $template.querySelector(".comment-date").textContent = date.toLocaleDateString("es-US");
                $template.querySelector(".comment-text").textContent = comment.comment;
                if (comment.commensal_id == idCommensal) {
                    //$template.querySelector(".comment-delete-icon").style.display = "none";
                    $template.querySelector(".comment-delete-icon").dataset.id_comment = comment.comment_id;
                }
                let $clone = document.importNode($template, true);
                $fragment.appendChild($clone);
            });
            document.querySelector(".comments-container").appendChild($fragment);
        }
    }).catch(error => {
        console.log(error);
    });
}


async function commentRestaurant(params) {
    const connection = new Connection("http://amigosinformaticos.ddns.net:42066");
    Connection.token = localStorage.getItem("token");
    Connection.cookies = localStorage.getItem("cookie");
    let idRestaurant = "5";
    const response = await connection.send("post", `restaurants/${idRestaurant}/comments`, null, params);
    console.log(response);
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
    currentDate = currentDate.getFullYear() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getDate();

    const params = {
        id_commensal: idCommensal,
        comment: comment,
        date: currentDate
    }

    if (validateCommentForm(comment, idCommensal)) {
        commentRestaurant(params).then(response => {
            if (response.status == 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'Comentario guardado con exito',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else if (response.status == 419) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Sesión caducada. Por favor, vuelva a iniciar sesión.',
                    showConfirmButton: true,
                    timer: 3000
                }).then(window.location = "/");

            }
        }).catch(error => {
            Swal.fire({
                icon: "error",
                title: "Fallo en la conexión",
                text: `Ocurrió un problema al comunicarse con el servidor.`
            });
        })
    }
});

document.addEventListener("DOMContentLoaded", function (event) {
    getRestaurant();
    getComments();
});


document.addEventListener("click", e => {
    if (e.target.matches(".comment-delete-icon")) {
        deleteComment(e);
    }
    console.log("Elemento clickeado", e.target);
});
