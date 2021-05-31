const $boxes = document.querySelector(".box"),
  $template = document.getElementById("template-box").content,
  $fragment = document.createDocumentFragment();

async function getRestaurants() {
  const connection = new Connection("http://amigosinformaticos.ddns.net:42066");
  const response = await connection.send("get", "restaurants");

  if (response.status === 200) {
    const restaurants = response.json;
    restaurants.forEach((restaurant) => {
      $template
        .querySelector("img")
        .setAttribute("src", "https://placeimg.com/200/200/arch");
      $template.querySelector("img").setAttribute("alt", "Restaurant");
      $template.querySelector(".restaurant-name").textContent = restaurant.name;
      $template.querySelector(".restaurant-location").textContent = restaurant.location;
      $template.querySelector(".restaurant-location").querySelector("i").textContent = "location_on";
      
      /*$template.querySelector(".restaurant-price").textContent = restaurant.price;
            $template.querySelector(".restaurant-schedule").textContent = restaurant.schedule;
            $template.querySelector(".restaurant-score").textContent = restaurant.score;*/
      let $clone = document.importNode($template, true);
      $fragment.appendChild($clone);
    });
    document.querySelector(".main").appendChild($fragment);
  } else {
    console.warn("Error en getRestaurants()");
  }
}

getRestaurants();

const restaurants = [
  {
    img: "https://placeimg.com/200/200/restaurants",
    name: "McDonald",
    schedule: "Lunes",
    price: "123",
    score: "1",
  },
  {
    img: "https://placeimg.com/200/200/animals",
    name: "McDonald",
    schedule: "Lunes",
    price: "123",
    score: "1",
  },
  {
    img: "https://placeimg.com/200/200/people",
    name: "McDonald",
    schedule: "Lunes",
    price: "123",
    score: "1",
  },
];
restaurants.forEach((restaurant) => {
  $template.querySelector("img").setAttribute("src", restaurant.img);
  $template.querySelector("img").setAttribute("alt", restaurant.name);
  $template.querySelector(".restaurant-name").textContent = restaurant.name;
  $template.querySelector(".restaurant-price").textContent = restaurant.price;
  $template.querySelector(".restaurant-schedule").textContent =
    restaurant.schedule;
  $template.querySelector(".restaurant-score").textContent = restaurant.score;
  let $clone = document.importNode($template, true);
  $fragment.appendChild($clone);
});

document.querySelector(".main").appendChild($fragment);
