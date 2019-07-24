
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

var looper = setInterval(function() {
	var uid = window.uid;
	var punchesRef = firebase.database().ref('users/' + uid + '/punches').orderByChild('priority');
	punchesRef.on('child_changed', function(data) {
		conLog("Child Changed");
		updatePunchElement(data.key, data.val());
//		deletePunchElement(data.key);
//		addPunchElement(data.key, data.val());
	});

	punchesRef.on('child_removed', function(data) {
		conLog("child Removed");
		deletePunchElement(data.key);
	});
}, 1000);

