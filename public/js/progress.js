function startPunch(reference) {
	conLog("function: startPunch(" + reference + ")");


	var exists = document.getElementById("timer" + reference);
	if ( exists === null ) {
		conLog("Generate Element: timer" + reference);
		genPunchListItem('<div id="timer' + reference + '" class="three columns punch-default started"></div>', '#details-col-one' + reference);
	}

	var timerExists = exists.innerHTML;
	conLog(timerExists);
	if (timerExists === null || timerExists === '') {
		conLog("createTimer(" + reference + ", " + time + ")");
		var time = new Date().getTime();
		createTimer("timer" + reference, time);
	}
}

function completePunch(reference) {

	conLog("function: completePunch(" + reference + ")");

	deletePunchElement(reference);

}

function setPunchProgress(reference, p) {

	conLog("function: setPunchProgress(" + reference + ", " + p + ")");

	var progress = {};
	progress['users/' + window.uid + '/punches/' + reference + '/progress'] = p;
	firebase.database().ref().update(progress);

	switch(p.toLowerCase()) {
		case "in progress":
			// execute
			var refClass = "inProgress";
			var rmClass = [ "punch-default", "waiting" ];

			var start = new Date().getTime();
			var startTime = {};
			startTime['users/' + window.uid + '/punches/' + reference + '/startTime'] = start;

			firebase.database().ref().update(startTime);
			//startPunch(reference);
			break;
		case "waiting":
			// execute
			var refClass = "waiting";
			var rmClass = [ "punch-default", "inProgress" ];
			break;
		case "done":
			var end = new Date().getTime();
			var endTime = {};
			endTime['users/' + window.uid + '/punches/' + reference + '/endTime'] = end;

			firebase.database().ref().update(endTime);
			positionLoop();
			//completePunch(reference);
			break;
		default:
			conLog("function: setStyle(" + reference + ", " + progress + "), did not match a condition. :(");
	}
//	setStyle(reference, p);
}
