var version = "2019.08.05-1123-alpha";
window.showDone = true;
var logging = false;

// stats declaration...
var cNew = 0;
var cInProgress = 0;
var cWaiting = 0;

//var punchesRef = firebase.database().ref('users/' + userId + '/punches');
//punchesRef.on('value', function(snapshot) {
//  updateStarCount(postElement, snapshot.val());
//});



// load everything up!
window.onload = function() {
  initApp();
	document.getElementById("versionInfo").innerHTML = version;

/*
	$(document).ready(function(){
		$('.fixed-action-btn').floatingActionButton();
	});
*/
};

//	var uid = window.uid;

function listenerDone(uid) {
	conLog("Loading Punches...");
	//document.getElementById("sortable").innerHTML = '';
	var punchesRef = firebase.database().ref('users/' + uid + '/punches').orderByChild('priority');
	var itemStyle = "punches";
//	list = '<ol id="sortable">';

	punchesRef.on('child_added', function(data) {
		conLog("child Added");
		addPunchElementDone(data.key, data.val());
		countStats();
	});

//	mkSortable();
//	sortList();
//}

//var looper = setInterval(function() {
//	var punchesRef = firebase.database().ref('users/' + uid + '/punches').orderByChild('priority');
	punchesRef.on('child_changed', function(data) {
			conLog("Child Changed");
			updatePunchElement(data.key, data.val());
			countStats();
//		deletePunchElement(data.key);
//		addPunchElement(data.key, data.val());
	});

	punchesRef.on('child_removed', function(data) {
		conLog("child Removed");
		deletePunchElement(data.key);
		countStats();
	});
//}, 1000);
}

