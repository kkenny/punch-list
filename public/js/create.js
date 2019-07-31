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

	document.getElementById("newSubject").value = '';
	document.getElementById("newPriority").value = "[number]";
	document.getElementById("timepickerCreate").value = 'Month dd, YYYY [00-23]:[00-59]';
	document.getElementById("newNotes").value = '';
	document.getElementById("tagsCreate").value = 'tag1,tag2, tag3';


	disableElement('punchListAll');
	enableElement('newEvent');

}

function createNewEvent() {

	var subjectField = document.getElementById("newSubject").value;
	var priorityField = document.getElementById("newPriority").value;
	var progressField = document.getElementById("newProgress").value;
	var nDateField = document.getElementById("timepickerCreate").value;
	var notesField = document.getElementById("newNotes").value;

	if ( nDateField === 'Month dd, YYYY [00-23]:[00-59]' ) {
		nDateField = '';
	}

	if ( priorityField == null || priorityField === '' || priorityField === '[number]' ) {
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

function createTemplateForm() {
	var html = '';

	html += '<div class="form-label">Cadence</div>';
	html += '<input type="radio" name="cadence" style="margin: 5px;" onclick=setCadenceForm("daily") value="daily" checked>Daily</input>';
	html += '<input type="radio" name="cadence" style="margin: 5px;" onclick=setCadenceForm("weekly") value="weekly">Weekly</input>';
	html += '<input type="radio" name="cadence" style="margin: 5px;" onclick=setCadenceForm("monthly") value="monthly">Monthly</input>';
	html += '<input type="radio" name="cadence" style="margin: 5px;" onclick=setCadenceForm("annually") value="annually">Annually</input>';
	html += '<input type="hidden" id="templateCadence" value="daily">';
	html += '<div class="form-label">Subject: </div>';
	html += '<input onfocus="clearDefault(this)" class="u-full-width" type="text" id="templateSubject" value="">';
	html += '<div class="form-label">Priority: </div>';
	html += '<input onfocus="clearDefault(this)" class="u-full-width" type="text" id="templatePriority" value="[number]">';
	html += '<input type="hidden" id="templateProgress" value="new">';
	html += '<div id="label-needby" class="form-label">Need By Time (Each Day):</div>';
	html += '<input onfocus="clearDefault(this)" type="text" id="timepickerTemplate" class="datepicker-here u-full-width" data-timepicker="true" data-language="en" value="[hh:mm] ie: 17:45">';
	html += '<div class="form-label">Tags: </div>';
	html += '<input onFocus="clearDefault(this)" type="text" id="tagsTemplate" class="u-full-width" value="tag1,tag2, tag3">';
	html += '<div class="form-label">Notes: </div>';
	html += '<textarea class="u-full-width" id="templateNotes" value=""></textarea>';
	html += '<button id="subit-template" class="form-button" onClick="createTemplate()">Create</button>';
	html += '<button id="nevermind"class="form-button" onClick="disableElement(templatePunch),enableElement(punchListAll)">Nevermind.</button>';

	document.getElementById("templatePunch").innerHTML = html;

	disableElement("punchListAll");
	enableElement("templatePunch");
}

function setCadenceForm(s) {
	document.getElementById('templateCadence').value = s;

	switch(s) {
		case "daily":
			document.getElementById('label-needby').innerHTML = 'Need By Time (Each Day):';
			document.getElementById('timepickerTemplate').defaultValue = '[hh:mm] ie: 17:45';
			document.getElementById('timepickerTemplate').value = '[hh:mm] ie: 17:45';
			break;
		case "weekly":
			document.getElementById('label-needby').innerHTML = 'Need By Day of Week:';
			document.getElementById('timepickerTemplate').defaultValue = '[1-7]';
			document.getElementById('timepickerTemplate').value = '[1-7]';
			break;
		case "monthly":
			document.getElementById('label-needby').innerHTML = 'Need By Day of Month:';
			document.getElementById('timepickerTemplate').defaultValue = '[1-31]';
			document.getElementById('timepickerTemplate').value = '[1-31]';
			break;
		case "annually":
			document.getElementById('label-needby').innerHTML = 'Need By Date (Each Year):';
			document.getElementById('timepickerTemplate').defaultValue = 'Month dd, YYYY [00-23]:[00-59]';
			document.getElementById('timepickerTemplate').value = 'Month dd, YYYY [00-23]:[00-59]';
			break;
	}
}

function createTemplate() {
	var cadence = document.getElementById("templateCadence").value;
	var subjectField = document.getElementById("templateSubject").value;
	var priorityField = document.getElementById("templatePriority").value;
	var progressField = document.getElementById("templateProgress").value;
	var nDateField = document.getElementById("timepickerTemplate").value;
	var notesField = document.getElementById("templateNotes").value;
	var newTag = document.getElementById("tagsTemplate").value.toLowerCase();

	if ( nDateField === 'Month dd, YYYY [00-23]:[00-59]' ) {
		nDateField = '';
	}

	if ( priorityField == null || priorityField === '' || priorityField === '[number]' ) {
		priorityField = 99;
	}

	if ( newTag === 'tag1,tag2, tag3' ) {
		newTag = '';
	}

	var stripLeadingSpace = newTag.replace(/, /g, ',');
	var noSpaces = stripLeadingSpace.replace(/ /g, '_');
	var newTags = noSpaces.split(",");

	newPunchTemplate(window.uid, subjectField, parseInt(priorityField), progressField, nDateField, notesField, newTags, cadence);

	disableElement("newEvent");
	enableElement("punchListAll");

	sortList();
	enableElement('punchListAll');
	disableElement('templatePunch');
	document.getElementById("templatePunch").innerHTML = '';
}

function newPunchTemplate(uid, subject, priority, progress, needBy, notes, tags, cadence) {
	conLog("function: newPunch(" + uid + ", " + subject + ", " + priority + ", " + progress + ", " + needBy + ", " + notes + ", " + tags + ")");
	var punchData = {
		subject: subject,
		priority: priority,
		progress: progress,
		needByDate: needBy,
		notes: notes,
		tags: tags
	};

	//Get a key for a new post
	var newPunchKey = firebase.database().ref().child('users/' + window.uid + '/punchTemplates/' + cadence).push().key;

	// Write the new punch data
	var updates = {};
	updates['users/' + uid + '/punchTemplates/' + cadence +'/' + newPunchKey] = punchData;

	firebase.database().ref().update(updates);
}

