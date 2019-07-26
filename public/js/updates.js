
function updateElementData(element, d) {

	var exists = document.getElementById(element);

	if ( exists != null || exists != undefined ) {
		var e = document.getElementById(element).innerHTML;

		if ( d != e ) {
			conLog("updating: " + element + ", with: " + d + ", was: " + e);
			document.getElementById(element).innerHTML = d;
		} else if ( d === e ) {
			conLog("Not Updating: " + element + ", because: " + d + " === " + e);
		} else {
			conLog("Not updating: " + element + ", because: Something weird happened with: " + d + " & " + e);
		}
	} else {
		conLog("add new element");
	}
}

function updatePunchElement(childKey, childData) {

	setStyle(childKey, childData.progress);

	if (childData.progress.toLowerCase != "done") {
		updateElementData("priority" + childKey, childData.priority);
		$( '#' + childKey).attr("priority", childData.priority);
		updateElementData("subject" + childKey, childData.subject);
		updateElementData("progress" + childKey, childData.progress);
		updateElementData("neededby-data" + childKey, childData.needByDate);
	}
}

