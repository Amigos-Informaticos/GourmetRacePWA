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
const activeStars = () => {
  const $ratings = document.getElementsByClassName("rating");
  for($rating of $ratings){

    let rounded = Math.round(($rating.dataset.score * 5) / 10);
    if(rounded > 5) {
      rounded = 5;
    }
    for(let i = 0; i<rounded; i++){
      $rating.children[i].className = "rating__star fas fa-star";
    }
  }          
}

const loadPrice = () => {
  $prices = [...document.getElementsByClassName("restaurant-price")];
      $prices.forEach(price_container => {
        for(let i = 0; i < price_container.dataset.price; i++){
          let $icon = document.createElement("i");
          $icon.setAttribute("class", "fas fa-dollar-sign");
          price_container.appendChild($icon);
      }        
      });
}

const clearMain = () => {
  $main = document.querySelector(".main");
  if($main.hasChildNodes()){
    while($main.childNodes.length >= 1){
      $main.removeChild($main.firstChild);
    }
  }
}

async function getRestaurants(category = "", name = "") {
  const $template = document.getElementById("template-box").content,
  $fragment = document.createDocumentFragment(),
  $main = document.querySelector(".main");

  const connection = new Connection("http://amigosinformaticos.ddns.net:42066");
  let response = {};
    if(category && category !== "") {
      response = await connection.send("get", "restaurants", {category});
    } else if(name && name !== ""){
      response = await connection.send("get", "restaurants", {name});
    } else {
      response = await connection.send("get", "restaurants");
    }
  
    if (response.status === 200) {
      const restaurants = response.json;
      console.log(restaurants);
      restaurants.forEach((restaurant) => {
        $template.querySelector(".box").setAttribute("id", `box-${restaurant.id_restaurant}`);
        $template.querySelector(".box").dataset.id_restaurant = restaurant.id_restaurant;
        $template.querySelector("img").setAttribute("src",
         restaurant.images[0]?restaurant.images[0]:"/images/restaurant-default.jpg");        
        $template.querySelector("img").setAttribute("alt", "Restaurant");
        $template.querySelector("img").dataset.id_restaurant = restaurant.id_restaurant;
        $template.querySelector(".restaurant-name").textContent = restaurant.name;
        $template.querySelector(".restaurant-name").dataset.id_restaurant = restaurant.id_restaurant;
        $template.querySelector(".restaurant-location").setAttribute("href",`${restaurant.location}`);
        $template.querySelector(".restaurant-location").setAttribute("target", "_blank");
        $template.querySelector(".restaurant-location").textContent = "Ubicación";        
        $template.querySelector(".restaurant-price").dataset.id_restaurant = restaurant.id_restaurant;  
        $template.querySelector(".restaurant-price").dataset.price = restaurant.price;

        

        if(restaurant.schedules && restaurant.schedules.length > 0){          
          restaurant.schedules.forEach(objDay => {
            let day = new Date();
            day = day.getDay();
            let isOpen = false;            
            if(objDay.day == day){
              isOpen = true;              
            }

            if(isOpen){
              $template.querySelector(".restaurant-schedule").textContent = 
              `${objDay.startTime} - ${objDay.endTime}`;

            } else {
              $template.querySelector(".restaurant-schedule").textContent = "Cerrado";
            }                          
          })                              
        }
           
        $template.querySelector(".rating").dataset.id_restaurant = restaurant.id_restaurant;   
        $template.querySelector(".rating").dataset.score = restaurant.score;
        $template.querySelector(".box-text-container").dataset.id_restaurant = restaurant.id_restaurant;    
       
        
        let $clone = document.importNode($template, true);
        $fragment.appendChild($clone);
      });
      
      clearMain();
      document.querySelector(".main").appendChild($fragment);
      loadPrice();
      activeStars();
      
    } else if (response.status === 204){
      Swal.fire({
        icon: 'warning',
        title: 'No se encontraron restaurantes'         
      });
    }
}

$("#restaurantButton").click(function(){
  window.location = "/src/view/register.html";
});


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
    }
 });
}

function isOpen(schedules = []){
  let isOpen = false;
  let currentDate = new Date();
  let startDate = new Date();
  let endDate = new Date();
  let time = Date.now();
  if(schedules.length > 0){
    schedules.forEach(element => {
      time = element.start_time.split(":");
      isOpen = element.day == currentDate.getDay();


      isOpen = startDate.setHours(element.start_time.split(":")[0])
    });
  }
}




document.addEventListener("dblclick", e=>{
  console.log(e.target)
  if (e.target.matches(".box, .box-text-container,.box-text-container > *")) {
    if(e.target.dataset.id_restaurant){
      console.log("Box clicked");
      localStorage.setItem("idRestaurant", e.target.dataset.id_restaurant);
      window.location = "/src/view/restaurantInfo.html"
    }
  }  
})

document.addEventListener("keydown", e=>{  
  if (e.target.matches("#searchInput") && e.key == "Enter"){
    let searchValue = e.target.value;
    if(searchValue && searchValue.length>0){      
      getRestaurants(undefined, searchValue);

    }
    
  }  
})

getCategories();
getRestaurants();
document.addEventListener("load", function (event) { 
   
  
});





