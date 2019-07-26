var version = "2019.07.26-1538";

var logging = false;

//var punchesRef = firebase.database().ref('users/' + userId + '/punches');
//punchesRef.on('value', function(snapshot) {
//  updateStarCount(postElement, snapshot.val());
//});



// load everything up!
window.onload = function() {
  initApp();
	document.getElementById("versionInfo").innerHTML = version;
	document.getElementById("versionInfo").innerHTML += '<br /><a href="#" onClick="isListSorted()">Sorted?</a>';
};

//	var uid = window.uid;

function listener(uid) {
	conLog("Loading Punches...");
	//document.getElementById("sortable").innerHTML = '';
	var punchesRef = firebase.database().ref('users/' + uid + '/punches').orderByChild('priority');
	var itemStyle = "punches";
//	list = '<ol id="sortable">';

	punchesRef.on('child_added', function(data) {
		conLog("child Added");
		addPunchElement(data.key, data.val());
	});

//	mkSortable();
//	sortList();
//}

//var looper = setInterval(function() {
//	var punchesRef = firebase.database().ref('users/' + uid + '/punches').orderByChild('priority');
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
//}, 1000);
}

