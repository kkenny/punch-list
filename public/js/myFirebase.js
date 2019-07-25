var version = "2019.07.25-1600";

var logging = false;

//var punchesRef = firebase.database().ref('users/' + userId + '/punches');
//punchesRef.on('value', function(snapshot) {
//  updateStarCount(postElement, snapshot.val());
//});

function loadPunches(uid) {
	conLog("Loading Punches...");
	//document.getElementById("sortable").innerHTML = '';
	var punchesRef = firebase.database().ref('users/' + uid + '/punches').orderByChild('priority');
	var itemStyle = "punches";
//	list = '<ol id="sortable">';

	punchesRef.on('child_added', function(data) {
		conLog("child Added");
		addPunchElement(data.key, data.val());
	});

	mkSortable();
	sortList();
}


// load everything up!
window.onload = function() {
  initApp();
	document.getElementById("versionInfo").innerHTML = version;
	document.getElementById("versionInfo").innerHTML += '<br /><a href="#" onClick="isListSorted()">Sorted?</a>';
};

