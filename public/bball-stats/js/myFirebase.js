var version = "2020.01.30-1328-alpha";

// load everything up!
window.onload = function() {
  initApp();
	//document.getElementById("versionInfo").innerHTML = version;
};

function listener() {
	//document.getElementById("sortable").innerHTML = '';
	var ref = firebase.database().ref('bball-stats/games').orderByChild('priority');

	punchesRef.on('child_added', function(data) {
//		addPunchElement(data.key, data.val());
	});

	punchesRef.on('child_changed', function(data) {
//			updatePunchElement(data.key, data.val());
	});

	punchesRef.on('child_removed', function(data) {
//		deletePunchElement(data.key);
	});
}

