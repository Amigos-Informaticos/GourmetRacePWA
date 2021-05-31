async function getCategories(){
  const $template = document.getElementById("template-categories").content,
  $fragment = document.createDocumentFragment();

  const connection = new Connection("http://amigosinformaticos.ddns.net:42066");
  const response = await connection.send("get", "categories");
  const categories = response.json;
  console.log(categories);

  categories.forEach(category => {
    $template.querySelector("a").dataset.id_category = category.id_category;
    $template.querySelector("a").textContent = category.category;
    $template.querySelector("a").setAttribute("onclick", `getRestaurants(${category.id_category})`);
    let $clone = document.importNode($template, true);
      $fragment.appendChild($clone);
  })
  document.getElementById("p-categories").appendChild($fragment);  
}

async function getRestaurants(category = "") {
  const $boxes = document.querySelector(".box"),
  $template = document.getElementById("template-box").content,
  $fragment = document.createDocumentFragment();

  const connection = new Connection("http://amigosinformaticos.ddns.net:42066");
  let response = {};
    if(category !== "") {
      response = await connection.send("get", "restaurants", {category});
    } else {
      response = await connection.send("get", "restaurants");
    }
  
    if (response.status === 200) {
      const restaurants = response.json;
      console.log(restaurants);
      restaurants.forEach((restaurant) => {
        $template
          .querySelector("img")
          .setAttribute("src", restaurant.images[0]);
        $template.querySelector("img").setAttribute("alt", "Restaurant");
        $template.querySelector(".restaurant-name").textContent = restaurant.name;
        $template.querySelector(".restaurant-location").setAttribute("href",`${restaurant.location}`);
        $template.querySelector(".restaurant-location").setAttribute("target", "_blank");
        $template.querySelector(".restaurant-location").textContent = "Ubicación";      
        $template.querySelector(".restaurant-price").textContent = restaurant.price;              
        $template.querySelector(".restaurant-schedule").textContent = `${restaurant.schedules[0].startTime} - ${restaurant.schedules[0].endTime}`; 
        $template.querySelector(".rating").dataset.score_rating = restaurant.score;              
        
        let $clone = document.importNode($template, true);
        $fragment.appendChild($clone);
      });
      document.querySelector(".main").appendChild($fragment);      
    } else if (response.status === 204){
      alert("No se encontraron restaurantes");
    }
}


function executeRating(stars) {
  const starClassActive = "rating__star fas fa-star";
  const starClassInactive = "rating__star far fa-star";
  const starsLength = stars.length;
  let i;
  stars.map((star) => { 
    star.onclick = () => {
       i = stars.indexOf(star);

       if (star.className===starClassInactive) {        
          for (i; i >= 0; --i) stars[i].className = starClassActive;
       } else {
          for (i; i < starsLength; ++i) stars[i].className = starClassInactive;
       }
    };
 });
}

const setRating = function() {  
  const stars = [...document.getElementsByClassName("rating__star")];
  const starClassActive = "rating__star fas fa-star";
  const starClassInactive = "rating__star far fa-star";
  const starsLength = stars.length;
  const rating = [...document.querySelectorAll(".rating")];
  let i = 0;
  let starCount = Number.parseInt(rating[i].dataset.score_rating);
  stars.forEach(star => {
    star
  })
  for(i; i<=starCount-1 && i<= starsLength;i++){
    if(stars[i].className === starClassInactive){
      stars[i].className = starClassActive;
    } 
  }
}

const activeStars = () => {
  const $ratings = document.getElementsByClassName("rating");
  for(let rating of $ratings){
    let scoreRestaurants = Number.parseInt(rating.dataset.score_rating);
    if(scoreRestaurants>5){
      scoreRestaurants = 5;
    }
    for(let i = 0; i<=scoreRestaurants; i++){
      rating.children[i].className = "rating__star fas fa-star";
    }
  }
}

getCategories();
getRestaurants();


function isOpen(schedules = []){
  let isOpen = false;
  let currentDate = new Date();
  let startDate = new Date();
  let endDate = new Date();
  const time = Date.now();
  if(schedules.length > 0){
    schedules.forEach(element => {
      time = element.start_time.split(":");
      isOpen = element.day == currentDate.getDay();
      

      isOpen = startDate.setHours(element.start_time.split(":")[0]) 
    });
  }
}

function getRestaurantsTest(){
  const restaurants = [
    {
      img: "https://placeimg.com/200/200/restaurants",
      name: "McDonald",
      schedule: "Lunes",
      location: "https://www.google.com/",
      price: "123",
      score: "1",
    },
    {
      img: "https://placeimg.com/200/200/animals",
      name: "McDonald",
      schedule: "Lunes",
      location: "https://www.google.com/",
      price: "123",
      score: "1",
    },
    {
      img: "https://placeimg.com/200/200/people",
      name: "McDonald",
      schedule: "Lunes",
      location: "https://www.google.com/",
      price: "123",
      score: "1",
    },
  ];
  restaurants.forEach(restaurant => {
    $template.querySelector("img").setAttribute("src", restaurant.img);
    $template.querySelector("img").setAttribute("alt", restaurant.name);
    $template.querySelector(".restaurant-name").textContent = restaurant.name;
    $template.querySelector(".restaurant-price").textContent = restaurant.price;
    $template.querySelector(".restaurant-schedule").textContent =
      restaurant.schedule;
    $template.querySelector(".restaurant-location").setAttribute("href",`${restaurant.location}`);
    $template.querySelector(".restaurant-location").setAttribute("target", "_blank");
    $template.querySelector(".restaurant-location").textContent = "Ubicación";
    $template.querySelector(".restaurant-score").textContent = restaurant.score;
    let $clone = document.importNode($template, true);
    $fragment.appendChild($clone);
  });
  document.querySelector(".main").appendChild($fragment);
}

//getRestaurantsTest();


