if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("sw.js").then((e) => {
		console.log("Registrado");
		console.log(e);
	}).catch((error) => {
		console.error(error)
	});
}