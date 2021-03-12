if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("sw.js").then(e => {
		console.log("Registrado");
	}).catch(error => {
		console.error(error)
	});
}