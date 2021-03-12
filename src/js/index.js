if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("sw.js").then((registration) => {
		console.error("SW Registered");
		console.error(registration);
	}).catch((error) => {
		console.error("SW Registration Failed");
		console.error(error);
	});
}