self.addEventListener("install", (listenerObject) => {
	listenerObject.waitUntil(
		caches.open("static").then((cache) => {
			return cache.addAll(filesToCache);
		})
	);
});

self.addEventListener("fetch", (e) => {
	e.respondWith(
		caches.match(e.request).then((response) => {
			return response || fetch(e.request);
		})
	);
});

const filesToCache = [
	"./index.html",
	"./src/view/addRestaurant.html",
	"./src/view/editCommensal.html",
	"./src/view/editRestaurant.html",
	"./src/view/mainMenu.html",
	"./src/view/register.html",
	"./src/view/restaurantInfo.html",
	"./src/view/scoreReport.html",
	"./src/view/viewsReport.html",
	"./src/css/addRestaurant",
	"./src/css/colors.css",
	"./src/css/editRestaurant.css",
	"./src/css/inputs.css",
	"./src/css/login.css",
	"./src/css/main.css",
	"./src/css/mainMenu.css",
	"./src/css/register.css",
	"./src/css/restaurantInfo.css",
	"./src/css/scoreReport.css",
	"./src/css/viewReport.css",
	"./images/logo192.png",
	""
]