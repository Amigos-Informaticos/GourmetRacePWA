function clearContent(divId) {
	$("#" + divId).innerHTML = "";
}

function loadContent(objectiveURL, divId = "content") {
	clearContent(divId);
	$("#" + divId).load(objectiveURL);
}