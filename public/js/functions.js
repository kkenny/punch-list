// shorten calls to conLog
function conLog(logMessage) {
	if ( logging === true ) {
		conLog(logMessage);
	}
}

// Clear Default Values
function clearDefault(a){
	if (a.defaultValue === a.value) {
		a.value="";
	}
}

// Generate Daily Punches function
function genDaily() {
	conLog("function: genDaily()");

	var daily = [ "Check Workday", "Check Expenses", "Check Change Cases", "Check TD's", "Check at-mentions" ];
	conLog(daily[1]);
	priority = parseInt("3");

	var d = new Date();
	var needBy = d.setHours(17,0,0);

	var newTag = "work,daily";
	var stripLeadingSpace = newTag.replace(/, /g, ',');
	var noSpaces = stripLeadingSpace.replace(/ /g, '_');
	var newTags = noSpaces.split(",");

	for (x = 0; x < daily.length; x++) {
		newPunch(window.uid, daily[x], priority, "new", needBy, "", newTags);
	}

	sortList();
}

// Generate Weekly Punches function
function genWeekly() {
	conLog("function: genWeekly()");

//get next monday:
	// var d = new Date();
	// d.setDate(d.getDate() + (1 + 7 - d.getDay()) % 7);
	// conLog(d)

//	};
	var weekly = [ "Update ORB Notes", "Prep Weekly Meeting", "Review Epics on Release" ];
	var priority = parseInt("5");
	var newTag = "work,weekly";
	var stripLeadingSpace = newTag.replace(/, /g, ',');
	var noSpaces = stripLeadingSpace.replace(/ /g, '_');
	var newTags = noSpaces.split(",");
	var needBy = '';

	for (x = 0; x < weekly.length; x++) {
		newPunch(window.uid, weekly[x], priority, "new", needBy, "", newTags);
	}

	sortList();
}

// Set styles
function setStyle(reference, progress) {
	var refClass,
			rmClass,
			i,
			c;

	switch(progress.toLowerCase()) {
		case "new":
			// execute
			refClass = "punch-default";
			rmClass = [ "waiting", "inProgress" ];
			break;
		case "in progress":
			// execute
			refClass = "inProgress";
			rmClass = [ "punch-default", "waiting" ];
			startPunch(reference);
			break;
		case "waiting":
			// execute
			refClass = "waiting";
			rmClass = [ "punch-default", "inProgress" ];
			break;
		case "done":
			completePunch(reference);
			break;
		default:
			conLog("function: setStyle(" + reference + ", " + progress + "), did not match a condition. :(");
	}

	elementIds = [ '#' + reference, '#progress' + reference ];

	conLog("Element Ids: " + elementIds);
	for (i in elementIds) {
		for (c in rmClass) {
			conLog("Removing: " + rmClass[c] + ", from: " + elementIds[i]);
			$( elementIds[i] ).removeClass( rmClass[c] );
		}
		conLog("Adding: " + refClass + ", to: " + elementIds[i]);
		$( elementIds[i] ).addClass( refClass );
	}
}


// Make the list sortable
function mkSortable(){
	conLog("function: mkSortable()");
	$( function() {
		$( "#sortable" ).sortable({
			cancel: ".portlet-toggle",
			placeholder: "portlet-placeholder ui-corner-all",
			revert: true,
			distance: 50,
			start: function(event, ui) {
				//conLog($( this ).( "li" ));
				conLog(ui.item.context.id);
				conLog("Start Position: " + ui.item.index());
			},
			stop: function(event, ui) {
//				setPriority(window.sortObjectUUID, ui.item.index());
				conLog(event, ui);
				setPriority(ui.item.context.id, ui.item.index());
				conLog("New Position: " + ui.item.index());
				positionLoop();
			}
		});
	});
}

function isListSorted() {
	var sorted = true;

	$( "li" ).sort(function( a, b ){
		var delta = ($(a).attr('priority') - $(b).attr('priority'));

		if ( parseInt(delta) < 0 ) {

			conLog("Setting sorted to false, because: " + "a: " + $(a).attr('priority') + ", b: " + $(b).attr('priority') + ", Difference: " + ($(a).attr('priority') - $(b).attr('priority')));

			sorted = false;
		}
	});

	//console.log("Sorted: " + sorted);

	return sorted;
}

function sortList() {
	conLog('function: sortList()');

	var isSorted = isListSorted();

	if ( isSorted === false ) {
		var list = $('#sortable');
		var li = list.children('li');

		conLog(list);
		conLog(li);

		li.detach().sort(function(a, b) {
			conLog( $(a).attr('priority') );
			return $(a).attr('priority') - $(b).attr('priority');
		});

		list.append(li);
		positionLoop();
	}
}

//periodically make sure the list is sorted
var sortTheList = setInterval(function() {
	sortList();
}, 3000);

// Make details available
function enableDetail(){
	conLog("function: enableDetail()");
	$(function() {
    $( ".portlet" )
      .addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
      .find( ".details-container" )
        .addClass( "ui-corner-all" )
        .prepend( "<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");

    $( ".portlet-toggle" ).on( "click", function() {
      var icon = $( this );
      icon.toggleClass( "ui-icon-minusthick ui-icon-plusthick" );
      icon.closest( ".portlet" ).find( ".backlog-list-content" ).toggle();
    });
		$( "#sortable" ).disableSelection();
	});

// pop-over dialog
	$( "#dialog" ).dialog({ autoOpen: false });
	$( "#opener" ).click(function() {
		$( "#dialog" ).dialog( "open" );
	});
}

// some element functions...
function enableElement(element) {
	conLog("enabling element: " + element);
	document.getElementById(element).style.display = "block";
}

function disableElement(element) {
	conLog("disabling element: " + element);
	document.getElementById(element).style.display = "none";
}

function deletePunchElement(childKey) {
	$('#' + childKey).remove();
}

function createTimer(element,timeTo) {
	if (timeTo != null && timeTo != undefined && new Date(timeTo).getTime() != 'Invalid Date') {
		var x = setInterval(function() {
			distance = (new Date().getTime() - new Date(timeTo).getTime());
			seconds = Math.floor((distance / 1000) % 60);
			minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			days = Math.floor(distance / (1000 * 60 * 60 * 24));

			if (days < 0)     { days = -(days + 1);
													seconds = (seconds + 1);   }
			if (hours < 0)    { hours = (-(hours) - 1);    }
			if (hours < 10)   { hours = ('0' + hours);     }
			if (minutes < 0)  { minutes = -(minutes);      }
			if (minutes < 10) { minutes = ('0' + minutes); }
			seconds = (seconds -1); //really effing dumb.
			if (seconds < 0)  { seconds = -(seconds);      }
			if (seconds < 10) { seconds = ('0' + seconds); }

			//conLog("Setting Timer on element:" + element);

			var exists = document.getElementById(element);
			if (exists != null) {
				document.getElementById(element).innerHTML = days + "day(s), " + hours + ":" + minutes + ":" + seconds;
			} else {
//				conLog("Could not update: " + element + ", because: " + exists);
			}
		}, 1000);
	}
}

function formatDate(d) {
	d = new Date(d);
	var minutes = d.getMinutes();
	var hours = d.getHours();
	var month = (d.getMonth() + 1);

	if (minutes < 10) { minutes = ('0' + minutes); }
	if (hours === 0)  { hours = ('0' + hours);     }
	if (month < 10)   { month = ('0' + month);     }

	var	s = d.getFullYear() + '/' + month + '/' + d.getDate() + ' ' + hours + ':' + minutes;

	return s;
}
