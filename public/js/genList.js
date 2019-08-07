
function genPunchListItem(elementData, element) {
	$( elementData ).appendTo( element );
}

function addPunchElement(childKey, childData) {
	var style,
			time,
			tags,
			i,
			comma;

	if (childData.progress.toLowerCase() === "in progress") { style = "inProgress"; }
	else if (childData.progress.toLowerCase() === "waiting") { style = "waiting"; }
	else if (childData.progress.toLowerCase() === "new") { style = "punch-default"; }
	else { style = "punch-default"; }

	if (childData.progress.toLowerCase() != "done") {
		// Start List Item
		genPunchListItem('<li id="' + childKey + '" priority=' + childData.priority + ' class="ui-widget-content ui-helper-clearfix ui-corner-all newPunchLoad"></li>', '#sortable');
		genPunchListItem('<span id="handle' + childKey + '" class="material-icons drag_handle">drag_handle</span>', '#' + childKey);
		genPunchListItem('<div id="priority-wrapper' + childKey + '" class="priority-wrapper">', '#' + childKey);
		genPunchListItem('<span id="priority' + childKey + '" class="priority">' + childData.priority + '</span>', '#priority-wrapper' + childKey);
		genPunchListItem('<span id="subject' + childKey + '" class="subject truncate" onclick=openDetails("' + childKey +'")>' + childData.subject + '</span>', '#' + childKey);

		// Tags
		if ( childData.tags != undefined ) {
			tags = childData.tags;
			genPunchListItem('<div id="tags-container' + childKey + '" class="tags-wrapper"></div>', '#' + childKey);

			for (i=0; i<tags.length; i++) {
				tagData = tags[i];
				if ((tags.length - 1) === i) { comma = ' '; }
				else { comma = ','; }
				genPunchListItem('<span id="tag-' + tagData + childKey + '" class="tags-details ' + tagData +'" onClick=tagFilter("' + tagData + '")>' + tagData + '</span><span style="color: #fff;">' + comma + '&nbsp;</span>', '#tags-container' + childKey);
			}
		}

		// Status Icons
		genPunchListItem('<div id="set_status' + childKey + '" class="status-icons"></div>', '#' + childKey);
		genPunchListItem('<span id="start-icon' + childKey + '" class="icon-start material-icons" onClick=\'setPunchProgress("' + childKey + '", "in progress")\'>play_circle_outline</span>', '#set_status' + childKey);
		genPunchListItem('<span id="wait-icon' + childKey + '" class="icon-wait material-icons" onClick=\'setPunchProgress("' + childKey + '", "waiting")\'>error_outline</span>', '#set_status' + childKey);
		genPunchListItem('<span id="finish-icon' + childKey + '" class="icon-finish material-icons" onClick=\'setPunchProgress("' + childKey + '", "done")\'>check_circle_outline</span>', '#set_status' + childKey);
		genPunchListItem('<span id="edit-icon' + childKey + '" class="icon-edit material-icons" onClick=\'editPunch("' + childKey + '")\'>edit</span>', '#set_status' + childKey);

		setStyle(childKey,childData.progress);


		// Need By Date & Timer
		genPunchListItem('<div id="needby-wrapper' + childKey + '" class="needby-wrapper"></div>', '#' + childKey);
		if ( childData.needByDate != null && childData.needByDate != undefined && childData.needByDate != '' ) {
			genPunchListItem('<span id="needby-data' + childKey + '" class="needby-date">' + formatDate(childData.needByDate) + '</span>', '#needby-wrapper' + childKey);
			genPunchListItem('<span id="needby-date-timer' + childKey + '" class="needby-timer">Loading...</span>', '#needby-wrapper' + childKey);
			createTimer('needby-date-timer' + childKey, childData.needByDate);

			if ( (new Date(childData.needByDate).getTime() - new Date().getTime()) <= 0 ) {
					$( '#needby-wrapper' + childKey ).addClass( "overdue" );
			} else if ( ((new Date(childData.needByDate).getTime() - new Date().getTime()) / 1000) <= 259200 ) {
					$( '#needby-wrapper' + childKey ).addClass( "duesoon" );
			}
		}

		setTimeout(function(){
			$('#' + childKey).removeClass('newPunchLoad');
		}, 5000);

	}

}
// end function addPunchElement(childKey, childData); //

function addPunchElementDone(childKey, childData) {
	var style,
			time,
			tags,
			i,
			comma;

	if (childData.progress.toLowerCase() === "in progress") { style = "inProgress"; }
	else if (childData.progress.toLowerCase() === "waiting") { style = "waiting"; }
	else if (childData.progress.toLowerCase() === "new") { style = "punch-default"; }
	else { style = "punch-default"; }

	if (childData.progress.toLowerCase() === "done") {
		// Start List Item
		genPunchListItem('<li id="' + childKey + '" priority=' + childData.priority + ' class="ui-widget-content ui-helper-clearfix ui-corner-all newPunchLoad"></li>', '#sortable');
		genPunchListItem('<span id="handle' + childKey + '" class="material-icons drag_handle">drag_handle</span>', '#' + childKey);
		genPunchListItem('<div id="priority-wrapper' + childKey + '" class="priority-wrapper">', '#' + childKey);
		genPunchListItem('<span id="priority' + childKey + '" class="priority">' + childData.priority + '</span>', '#priority-wrapper' + childKey);
		genPunchListItem('<span id="subject' + childKey + '" class="subject truncate" onclick=openDetails("' + childKey +'")>' + childData.subject + '</span>', '#' + childKey);

		// Tags
		if ( childData.tags != undefined ) {
			tags = childData.tags;
			genPunchListItem('<div id="tags-container' + childKey + '" class="tags-wrapper"></div>', '#' + childKey);

			for (i=0; i<tags.length; i++) {
				tagData = tags[i];
				if ((tags.length - 1) === i) { comma = ' '; }
				else { comma = ','; }
				genPunchListItem('<span id="tag-' + tagData + childKey + '" class="tags-details ' + tagData +'" onClick=tagFilter("' + tagData + '")>' + tagData + '</span><span style="color: #fff;">' + comma + '&nbsp;</span>', '#tags-container' + childKey);
			}
		}

		// Status Icons
		genPunchListItem('<div id="set_status' + childKey + '" class="status-icons"></div>', '#' + childKey);
		genPunchListItem('<span id="start-icon' + childKey + '" class="icon-start material-icons" onClick=\'setPunchProgress("' + childKey + '", "in progress")\'>play_circle_outline</span>', '#set_status' + childKey);
		genPunchListItem('<span id="wait-icon' + childKey + '" class="icon-wait material-icons" onClick=\'setPunchProgress("' + childKey + '", "waiting")\'>error_outline</span>', '#set_status' + childKey);
		genPunchListItem('<span id="edit-icon' + childKey + '" class="icon-edit material-icons" onClick=\'editPunch("' + childKey + '")\'>edit</span>', '#set_status' + childKey);
		genPunchListItem('<span id="delete-icon' + childKey + '" class="icon-delete material-icons" onClick=\'deletePunch("' + childKey + '")\'>delete_forever</span>', '#set_status' + childKey);

		setStyle(childKey,childData.progress);


		// Need By Date & Timer
		genPunchListItem('<div id="needby-wrapper' + childKey + '" class="needby-wrapper"></div>', '#' + childKey);
		if ( childData.needByDate != null && childData.needByDate != undefined && childData.needByDate != '' ) {
			genPunchListItem('<span id="needby-data' + childKey + '" class="needby-date">' + formatDate(childData.needByDate) + '</span>', '#needby-wrapper' + childKey);
			genPunchListItem('<span id="needby-date-timer' + childKey + '" class="needby-timer">Loading...</span>', '#needby-wrapper' + childKey);
			createTimer('needby-date-timer' + childKey, childData.needByDate);

			if ( (new Date(childData.needByDate).getTime() - new Date().getTime()) <= 0 ) {
					$( '#needby-wrapper' + childKey ).addClass( "overdue" );
			} else if ( ((new Date(childData.needByDate).getTime() - new Date().getTime()) / 1000) <= 259200 ) {
					$( '#needby-wrapper' + childKey ).addClass( "duesoon" );
			}
		}

		setTimeout(function(){
			$('#' + childKey).removeClass('newPunchLoad');
		}, 5000);

	}

}
// end function addPunchElement(childKey, childData); //
