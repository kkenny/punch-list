// function for creating new punches
function newPunch(uid, subject, priority, progress, needBy, notes, tags) {
	conLog("function: newPunch(" + uid + ", " + subject + ", " + priority + ", " + progress + ", " + needBy + ", " + notes + ", " + tags + ")");
	var punchData = {
		uid: uid,
		subject: subject,
		priority: priority,
		progress: progress,
		needByDate: needBy,
		notes: notes,
		tags: tags
	};

	//Get a key for a new post
	var newPunchKey = firebase.database().ref().child('users/' + window.uid + '/punches').push().key;

	// Write the new punch data
	var updates = {};
	updates['users/' + uid + '/punches/' + newPunchKey] = punchData;

	return firebase.database().ref().update(updates);
}

// create new punch
function genEventForm() {
	document.getElementById("newSubject").value = "subject";
	document.getElementById("newPriority").value = "priority";
	document.getElementById("timepickerCreate").value = "date";
	document.getElementById("newNotes").value = '';
	document.getElementById("tagsCreate").value = 'tag1,tag2, tag3';

	disableElement('punchListAll');
	enableElement('newEvent');

}

function createNewEvent() {
	disableElement("punchListAll");
	enableElement("newEvent");

	var subjectField = document.getElementById("newSubject").value;
	var priorityField = document.getElementById("newPriority").value;
	var progressField = document.getElementById("newProgress").value;
	var nDateField = document.getElementById("timepickerCreate").value;
	var notesField = document.getElementById("newNotes").value;

	if ( nDateField === 'date' ) {
		nDateField = '';
	}

	if ( priorityField == null || priorityField === '' || priorityField === 'priority' ) {
		priorityField = 99;
	}

	if ( priorityField < 100 ) {
		priorityField--;
	}

	var newTag = document.getElementById("tagsCreate").value.toLowerCase();

	if ( newTag === 'tag1,tag2, tag3' ) {
		newTag = '';
	}

	var stripLeadingSpace = newTag.replace(/, /g, ',');
	var noSpaces = stripLeadingSpace.replace(/ /g, '_');
	var newTags = noSpaces.split(",");

	newPunch(window.uid, subjectField, parseInt(priorityField), progressField, nDateField, notesField, newTags);

	disableElement("newEvent");
	enableElement("punchListAll");

	sortList();
//	loadPunches(window.uid);
//	document.getElementById("newEventList").innerHTML = jsonStr;
}
