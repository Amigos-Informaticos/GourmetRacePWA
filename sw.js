self.addEventListener("install", (listenerObject) => {
	listenerObject.waitUntil(
		caches.open("static").then((cache) => {
			return cache.addAll([
				"./",
				"./src/css/main.css",
				"./images/logo192.png"
			]);
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