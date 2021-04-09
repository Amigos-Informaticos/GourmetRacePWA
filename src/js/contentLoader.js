function clearContent(divId) {
	$("#" + divId).innerHTML = "";
}

function loadContent(objectiveURL, targetId = "content") {
	clearContent(targetId);
	localStorage.setItem("activePage", objectiveURL);
	$("#" + targetId).load(objectiveURL);
	console.clear();
}

function loadLastPage() {
	let lastPage = localStorage.getItem("activePage");
	if (lastPage != null) {
		loadContent(lastPage);
	}
}