// edit punch
function editPunch(uuid) {
//	disableElement("punchListAll");
//	enableElement("editPunch");
	openDrawer('edit-event-wrapper');

	var punchRef = firebase.database().ref('users/' + uid + '/punches/' + uuid);


	punchRef.once('value').then(function(snapshot) {
		var data = snapshot.val();
		conLog(data);

	var nDate = new Date(data.needByDate);
	var notes = data.notes;
	var priority = data.priority;
	var progress = data.progress;
	var subject = data.subject;
	var tags = data.tags;

	var html = '<div class="container listWrapper">';
	html += '<input type=hidden id="editID" value="' + uuid + '">';
	html += '<div class="edit-row"><div class="three columns">Subject:</div><div class="nine columns"><input class="twelve columns" type=text id="editSubject" value="' + subject + '"></div></div>';
	html += '<div class="three columns">Priority:</div><div class="nine columns"><input type=text id="editPriority" value="' + priority + '"></div>';
	html += '<div class="three columns">Need By:</div><div class="nine columns"><input type=text id="timepickerEdit" value="' + nDate + '"></div>';
	html += '<div class="three columns">Progress:</div><div id="editProgress" class="nine columns">';
	html +=  progress;
	html += '</div>';
	html += '<div class="three columns">Add Tag:</div><div class="nine columns"><input type="text" id="editTags" value="' + tags + '"></div>';
	html += '<div class="three columns">Notes: </div><div class="nine columns"><textarea class="edit-text-box" id="editNotes">' + notes + '</textarea></div>';
	html += '<button onClick=submitEditPunch("' + uuid + '") class="form-button">Update</button>';
	html += '<button onClick=\'closeDrawer("edit-event-wrapper")\' class="form-button">Close</button>';
	html += '</div>';

	document.getElementById("editPunch").innerHTML = html;
	});

	watchFunctions();

}

function submitEditPunch(uuid) {
	var punchRef = firebase.database().ref('users/' + window.uid + '/punches/' + uuid);

//	var uuid = document.getElementById("editID").value;
	var subjectField = document.getElementById("editSubject").value;
	var priorityField = document.getElementById("editPriority").value;
	var progressField = document.getElementById("editProgress").innerHTML;
	var nDateField = document.getElementById("timepickerEdit").value;
	var notesField = document.getElementById("editNotes").value;

	if ( nDateField === 'date' || nDateField === 'Invalid Date' ) {
		nDateField = '';
	}

	if ( priorityField == null || priorityField === '' || priorityField === 'priority' ) {
		priorityField = 99;
	}

	var tagsField = document.getElementById("editTags").value.toLowerCase();
	if ( tagsField === 'tag1,tag2, tag3' ) {
		tagsField = '';
	}

	var stripLeadingSpace = tagsField.replace(/, /g, ',');
	var noSpaces = stripLeadingSpace.replace(/ /g, '_');
	var tagField = noSpaces.split(",");


	var punchData = {
		subject: subjectField,
		priority: priorityField,
		progress: progressField,
		needByDate: nDateField,
		notes: notesField,
		tags: tagField
	};

	var updates = {};
	updates['users/' + uid + '/punches/' + uuid] = punchData;
	firebase.database().ref().update(updates);
	closeDrawer('edit-event-wrapper');
//	enableElement('punchListAll');
}
