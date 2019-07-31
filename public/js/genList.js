
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
		genPunchListItem('<li id="' + childKey + '" priority=' + childData.priority + ' class="ui-widget-content ui-helper-clearfix ui-corner-all magictime puffIn"></li>', '#sortable');
		genPunchListItem('<span id="handle' + childKey + '" class="material-icons drag_handle">drag_handle</span>', '#' + childKey);
		genPunchListItem('<div id="priority-wrapper' + childKey + '" class="priority-wrapper">', '#' + childKey);
		genPunchListItem('<span id="priority' + childKey + '" class="priority">' + childData.priority + '</span>', '#priority-wrapper' + childKey);
		genPunchListItem('<span id="subject' + childKey + '" class="subject truncate">' + childData.subject + '</span>', '#' + childKey);

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
			$('#' + childKey).removeClass('magictime puffIn');
		}, 3000);

	}

}
// end function addPunchElement(childKey, childData); //

function OLDaddPunchElement(childKey, childData) {
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
		genPunchListItem('<li id="' + childKey + '" priority=' + childData.priority + ' class="ui-widget-content ui-helper-clearfix ui-corner-all ' + style + '"><div class="material-icons drag_handle">drag_handle</div></li>', '#sortable');
		genPunchListItem('<div id="div-portlet' + childKey + '" class="portlet"></div>', '#' + childKey);
		genPunchListItem('<div id="priority-container' + childKey + '" class="priority-container"></div>', '#div-portlet' + childKey);
		genPunchListItem('<div id="details-container' + childKey + '" class="container details-container"></div>', '#div-portlet' + childKey);
		genPunchListItem('<div id="priority' + childKey + '" class="twelve columns priority">' + childData.priority + '</div>', '#priority-container' + childKey);
		genPunchListItem('<div id="subject' + childKey + '" class="subject">' + childData.subject + '</div><div id="detail-link' + childKey + '" class="two columns u-pull-right"><button style="margin-left:50%; margin-right: 50%; width: 10px; margin-top:50%; margin-bottom: 50%" class="punch-default u-pull-right" onclick=toggleElement(\'backlog-list-content' + childKey + '\')>details</button></div>', '#details-container' + childKey);
		genPunchListItem('<div id="details-col-one' + childKey + '" class="progress-wrapper"></div>', '#details-container' + childKey);
		genPunchListItem('<div id="progress' + childKey +'" class="twelve columns ' + style + '">' + childData.progress + '</div>', '#details-col-one' + childKey);
		genPunchListItem('<div class="twelve columns punch-default" style="color: lime" id="timer' + childKey + '"></div>', '#details-col-one' + childKey);
		// status dropdown
		genPunchListItem('<div id="dropdown-wrapper' + childKey + '" class="dropdown"></div>', '#details-container' + childKey);
		genPunchListItem('<i onclick=\'progressMenuDrop("' + childKey + '")\' class="material-icons top dropbtn">menu</a>', '#dropdown-wrapper' + childKey);
		genPunchListItem('<div id="progressDropdown' + childKey + '" class="dropdown-content punch-default"></div>', '#dropdown-wrapper' + childKey);
		genPunchListItem('<a href="#" onClick=\'setPunchProgress("' + childKey + '", "new")\'>New</a>', '#progressDropdown' + childKey);
		genPunchListItem('<a href="#" onClick=\'setPunchProgress("' + childKey + '", "in progress")\'>Start</a>', '#progressDropdown' + childKey);
		genPunchListItem('<a href="#" onClick=\'setPunchProgress("' + childKey + '", "waiting")\'>Waiting</a>', '#progressDropdown' + childKey);
		genPunchListItem('<a href="#" onClick=\'setPunchProgress("' + childKey + '", "done")\'>Finish</a>', '#progressDropdown' + childKey);

		genPunchListItem('<div id="details-col-three' + childKey + '" class="needby-container punch-default"></div>', '#details-container' + childKey);
		genPunchListItem('<div id="details-col-five' + childKey + '" class="five columns punch-default"></div>', '#details-container' + childKey);
		if ( childData.needByDate != null && childData.needByDate != undefined && childData.needByDate != '' ) {
			genPunchListItem('<div id="neededBy' + childKey + '" class="twelve columns punch-default"></div>', '#details-col-three' + childKey);
			genPunchListItem('<div id="needby-data' + childKey + '">' + formatDate(childData.needByDate) + '</div>', '#neededBy' + childKey);
			genPunchListItem('<div id="needby-date-timer' + childKey + '"></div>', '#neededBy' + childKey);
			createTimer('needby-date-timer' + childKey, childData.needByDate);
			genPunchListItem('<div id="countdown-' + childKey + '" class="twelve columns punch-default"></div>', '#details-col-three' + childKey);

			if ( (new Date(childData.needByDate).getTime() - new Date().getTime()) <= 0 ) {
					$( '#needby-data' + childKey ).addClass( "overdue" );
			} else if ( ((new Date(childData.needByDate).getTime() - new Date().getTime()) / 1000) <= 259200 ) {
					$( '#needby-data' + childKey ).addClass( "duesoon" );
			}
		} else {
			genPunchListItem('<div>&nbsp;</div>', '#details-col-three' + childKey);
		}

		genPunchListItem('<div id="backlog-list-content' + childKey + '" class="backlog-list-content details-container"><div id="punch-list-backlog-details' + childKey + '" class="punch-list-backlog-details"></div></div>', '#div-portlet' + childKey) ;
		if ( childData.startTime != undefined ) {
			genPunchListItem('<div id="startTime" class="three columns punch-default started">' + formatDate(childData.startTime) + '</div>', '#punch-list-backlog-details' + childKey);
			time = new Date(childData.startTime).getTime();
			createTimer("timer" + childKey, time);
		}
		if ( childData.tags != undefined ) {
			tags = childData.tags;
			genPunchListItem('<div id="tags-container-summary' + childKey + '" class="twelve columns"></div>', '#details-col-five' + childKey);
			genPunchListItem('<div id="tags-container' + childKey + '" class="twelve columns"></div>', '#punch-list-backlog-details' + childKey);
			genPunchListItem('<div class="two columns tags-details">Tags: </div>', '#tags-container' + childKey);
			genPunchListItem('<div id="tags-column' + childKey + '" class="nine columns tags-details"></div>', '#tags-container' + childKey);

			for (i=0; i<tags.length; i++) {
				tagData = tags[i];
				if ((tags.length - 1) === i) { comma = ' '; }
				else { comma = ','; }
				genPunchListItem('<a id="tags-summary-' + tagData + childKey + '" class="punch-default tags-summary ' + tagData +'" href="#" onClick=tagFilter("' + tagData + '")>' + tagData + comma + '</a>', '#tags-container-summary' + childKey);
				genPunchListItem('<a id="tags-details-' + tagData + childKey + '" class="tags-details" href="#" onClick=tagFilter("' + tagData + '")>' + tagData + comma + '</a>', '#tags-column' + childKey);
			}
		}
		if ( childData.notes != "" ) {
			genPunchListItem('<textarea class="edit-text-box" readonly>' + childData.notes + '</textarea><br />', '#punch-list-backlog-details' + childKey);
		}
		genPunchListItem('<button class="button" onClick=editPunch("' + childKey + '")>edit</button>', '#punch-list-backlog-details' + childKey);
	}
}
