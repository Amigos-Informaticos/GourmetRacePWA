function clearContent(divId) {
	$("#" + divId).innerHTML = "";
}

function loadContent(objectiveURL, targetId = "content") {
	clearContent(targetId);
	localStorage.setItem("currentPage", objectiveURL);
	$("#" + targetId).load(objectiveURL);
}

function savePage() {
	localStorage.setItem(
		"lastPage",
		localStorage.getItem("currentPage")
	);
}

function loadLastPage() {
	let lastPage = localStorage.getItem("lastPage");
	if (lastPage != null) {
		loadContent(lastPage);
	}
}