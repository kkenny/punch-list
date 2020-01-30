// shorten calls to conLog
var logging = false;
function conLog(logMessage) {
	if ( logging === true ) {
		conLog(logMessage);
	}
}

// Find variables passed via URL
function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}

// Get variable from URL
//var gameId = getUrlVars()["gameId"];

// Handle if variable is missing from vars array
function getUrlParam(parameter, defaultvalue) {
	if (defaultvalue === null) {
		defaultvalue = "Empty";
	}

	var urlParameter = defaultvalue;
	if (window.location.href.indexOf(parameter) > -1) {
		urlParameter = getUrlVars()[parameter];
	}

	return urlParameter;
}

// Get variable with default value
var gameId = getUrlParam('gameId', 'missing');

// Clear Default Values
function clearDefault(a){
	if (a.defaultValue === a.value) {
		a.value='';
	}
}

function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    return d.getUTCFullYear() + '-' + weekNo;
}
// Check if daily punches have been created?

// /user/uid/autopunch/daily/YYYY-mm-dd = [true|false]

function getRndInteger(min, max) {
	var r = Math.floor(Math.random() * (max - min + 1) ) + min;

	conLog("getRndInteger: " + r);
	return r;
}

var cycleAutoPunch = setInterval(function() {
	autoPunch();
},getRndInteger(60000,120000) );

function autoPunch() {

	setTimeout(function() {
		conLog("[" + new Date() + "] - autoPunch");
		var d = new Date();
		var today = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
		var week = getWeekNumber(d);
		var month = d.getFullYear() + '-' + d.getMonth();

		firebase.database().ref('users/' + window.uid + '/autopunch/daily/created').once('value').then(function(snapshot) {
			var dayRef = snapshot.val();
			if ( dayRef != today ) {
				genDaily();
				firebase.database().ref('users/' + window.uid + '/autopunch/daily').update({
					created: today
				});
			}
		});

		firebase.database().ref('users/' + window.uid + '/autopunch/weekly/created').once('value').then(function(snapshot) {
			var weekRef = snapshot.val();
			if ( weekRef != week ) {
				genWeekly();
				firebase.database().ref('users/' + window.uid + '/autopunch/weekly').update({
					created: week
				});
			}
		});

		firebase.database().ref('users/' + window.uid + '/autopunch/monthly/created').once('value').then(function(snapshot) {
			var monthRef = snapshot.val();
			if ( monthRef != month ) {
				genMonthly();
				firebase.database().ref('users/' + window.uid + '/autopunch/monthly').update({
					created: month
				});
			}
		});
	},getRndInteger(getRndInteger(0,5000),getRndInteger(10000,55000)) );

}

function doesExist(subject) {
	var exists = false;
	$( "li" ).each(function( i, l ) {
		var punchRef = firebase.database().ref('users/' + window.uid + '/punches/' + l.id).once('value').then(function(snapshot) {
			var data = snapshot.val();
			var c_subject = data.subject;

			console.log('checking if ' + subject + ' matches ' + c_subject);

			if ( subject === c_subject ) {
				exists = true;
			}
			console.log(exists);

		});
	});

	return exists;

}

function genDaily() {
	console.log("Generating Daily");
	var ref = firebase.database().ref('users/' + window.uid + '/punchTemplates/daily');
	ref.once('value', function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			var doesPunchExist = '';
			var data = childSnapshot.val();
			console.log(data);
			var subject = data.subject,
					priority = data.priority,
					progress = "new",
					needByDate = data.needByDate,
					notes = data.notes,
					tags = data.tags,
					t = needByDate.split(':'),
					d = new Date();
			d.setHours(t[0]);
			d.setMinutes(t[1]);
			d.setSeconds(0);

			var needBy = d;

			doesPunchExist = doesExist(subject);
			console.log(subject + "exists? " + doesPunchExist);

			$( "li" ).each(function( i, l ) {
				var punchRef = firebase.database().ref('users/' + window.uid + '/punches/' + l.id).once('value').then(function(snapshot) {
					var data = snapshot.val();
					var c_subject = data.subject;

					console.log('checking if ' + subject + ' matches ' + c_subject);

					if ( subject === c_subject ) {
						exists = true;
					}
					console.log(exists);

				});
			});

			if ( doesPunchExist === false  ) {
				newPunch(window.uid, subject, priority, progress, needBy, notes, tags);
			} else {
				console.log("Punch Already Exists: " + subject);
			}

		});
	});
}

function genWeekly() {
	console.log("Generating Weekly");
	var ref = firebase.database().ref('users/' + window.uid + '/punchTemplates/weekly');
	ref.once('value', function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			var data = childSnapshot.val();
			console.log(data);
			var subject = data.subject,
					priority = data.priority,
					progress = "new",
					needByDate = data.needByDate,
					notes = data.notes,
					tags = data.tags,
					t = needByDate.split(':'),
					d = new Date();

			d.setDate(d.getDate() + (parseInt(needByDate.split(',')[0]) + 7 - d.getDay()) % 7);
			d.setHours(parseInt(needByDate.split(',')[1].split(':')[0]));
			d.setMinutes(parseInt(needByDate.split(':')[1]));
			d.setSeconds(0);

			var needBy = d;

			console.log("subject: " + subject);
			console.log("priority: " + priority);
			console.log("progress: " + progress);
			console.log("needby: " + needBy);
			console.log("notes: " + notes);
			console.log("tags: " + tags);

			newPunch(window.uid, subject, priority, progress, needBy, notes, tags);
		});
	});
}

function genMonthly() {
	console.log("Generating Monthly");
	var ref = firebase.database().ref('users/' + window.uid + '/punchTemplates/monthly');
	ref.once('value', function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			var data = childSnapshot.val();
			console.log(data);
			var subject = data.subject,
					priority = data.priority,
					progress = "new",
					needByDate = data.needByDate,
					notes = data.notes,
					tags = data.tags,
					t = needByDate.split(':'),
					d = new Date();

			d.setDate(parseInt(needByDate.split(',')[0]));
			d.setHours(parseInt(needByDate.split(',')[1].split(':')[0]));
			d.setMinutes(parseInt(needByDate.split(':')[1]));
			d.setSeconds(0);

			var needBy = d;

			console.log("subject: " + subject);
			console.log("priority: " + priority);
			console.log("progress: " + progress);
			console.log("needby: " + needBy);
			console.log("notes: " + notes);
			console.log("tags: " + tags);

			newPunch(window.uid, subject, priority, progress, needBy, notes, tags);
		});
	});
}
// Set styles
function setStyle(reference, progress) {
	var refClass,
			refElement,
			rmClass,
			i,
			c;

	switch(progress.toLowerCase()) {
		case "new":
			// execute
			refClass = "punch-default";
			break;
		case "in progress":
			// execute
			refElement = '#start-icon' + reference;
			refClass = "inProgress";
//			startPunch(reference);
			break;
		case "waiting":
			// execute
			refElement = '#wait-icon' + reference;
			refClass = "waiting";
			break;
		case "done":
			if (window.showDone != true) {
				completePunch(reference);
			}
			break;
		default:
			conLog("function: setStyle(" + reference + ", " + progress + "), did not match a condition. :(");
	}

	rmClass = [ "punch-default", "waiting", "inProgress" ];
	elementIds = [ '#start-icon' + reference, '#wait-icon' + reference ];

	conLog("Element Ids: " + elementIds);
	for (i in elementIds) {
		for (c in rmClass) {
			conLog("Removing: " + rmClass[c] + ", from: " + elementIds[i]);
			$( elementIds[i] ).removeClass( rmClass[c] );
		}
		conLog("Adding: " + refClass + ", to: " + refElement);
		$( refElement ).addClass( refClass );
	}
}

// statCounters
function countStats() {
	document.getElementById('stats-total').innerHTML = $('li').length;
	document.getElementById('stats-inprogress').innerHTML = $('.inProgress').length;
	document.getElementById('stats-waiting').innerHTML = $('.waiting').length;
	document.getElementById('stats-new').innerHTML = ( $('li').length - ( $('.waiting').length + $('.inProgress').length ) );
	document.getElementById('stats-overdue').innerHTML = $('.overdue').length;
	document.getElementById('stats-duesoon').innerHTML = $('.duesoon').length;
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
			delay: 300,
			handle: '.drag_handle',
			start: function(event, ui) {
				//conLog($( this ).( "li" ));
				//conLog("Context.id: " + ui.item.context.id);
				//conLog("Start Position: " + ui.item.index());
			},
			stop: function(event, ui) {
//				setPriority(window.sortObjectUUID, ui.item.index());
				conLog(event, ui);
				setPriority(ui.item.context.id, ui.item.index());
				//conLog("New Position: " + ui.item.index());
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

	//conLog("Sorted: " + sorted);

	return sorted;
}

function sortList() {
//	conLog('function: sortList()');

	var isSorted = isListSorted();

	if ( isSorted === false ) {
		var list = $('#sortable');
		var li = list.children('li');

		conLog(list);
		conLog(li);

		li.detach().sort(function(a, b) {
			//conLog("Attribute Priority: " + $(a).attr('priority'));
			return $(a).attr('priority') - $(b).attr('priority');
		});

		list.append(li);
		positionLoop();
	}
}

//periodically make sure the list is sorted
var sortTheList = setInterval(function() {
	sortList();
}, 1000);

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
				document.getElementById(element).innerHTML = days + " day(s), " + hours + ":" + minutes + ":" + seconds;
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

/* Open when someone clicks on the span element */
function openNav() {
  document.getElementById("myNav").style.width = "100%";
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

function openDetails(punch) {
	firebase.database().ref('users/' + window.uid + '/punches/' + punch).once('value').then(function(snapshot) {
		var data = snapshot.val();
		document.getElementById('details-subject').innerHTML = data.subject;
		document.getElementById('details-progress').innerHTML = data.progress;
		document.getElementById('details-tags').innerHTML = data.tags;
//		document.getElementById('details-notes').innerHTML = data.notes;
		document.getElementById('details-notes').innerHTML = replaceURLWithHTMLLinks(data.notes);
		document.getElementById('punch-details-content').innerHTML += '<div id="details-needby-date-timer' + punch + '" class="details-needby-timer"></div>';

		if ( data.notes == null || data.notes === '') {
			disableElement('details-notes-label');
			disableElement('details-notes');
		} else {
			enableElement('details-notes-label');
			enableElement('details-notes');
		}

		if ( data.tags == null || data.tags === '') {
			disableElement('details-tags-label');
		} else {
			document.getElementById('details-tags').style.display = 'inline-block';
		}


		if ( data.needByDate != null && data.needByDate != '' && data.needByDate != undefined) {
			conLog("nbd: " + data.needByDate);
			createTimer('details-needby-date-timer' + punch, data.needByDate);

			if ( (new Date(data.needByDate).getTime() - new Date().getTime()) <= 0 ) {
				$( '.details-needby-timer' ).addClass( 'overdue' );
			} else if ( ((new Date(data.needByDate).getTime() - new Date().getTime()) / 1000) <= 259200 ) {
				$( '.details-needby-timer' ).addClass( 'duesoon' );
			}
		}
	});

  document.getElementById("punch-details").style.height = "100%";
	focusTimer();
}

function closeDetails() {
  document.getElementById("punch-details").style.height = "0%";
	clearInterval(window.focusTimerCountdown);
	$( '.details-needby-timer' ).remove();
}

function focusTimer() {
	var element = 'punch-details-timer';
	var focusTime = 25; // in minutes
	var breakTime = 5;  // in minutes

	var d = new Date();
	var l;

	startFocus();

	function startFocus() {
		l = new Date(d.setMinutes(d.getMinutes() + focusTime));
		disableElement('punch-details-break');
		enableElement('punch-details-content');
		focus = true;

		window.focusTimerCountdown = setInterval(function() {
			distance = (new Date().getTime() - l.getTime());
			seconds = Math.floor((distance / 1000) % 60);
			minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			days = Math.floor(distance / (1000 * 60 * 60 * 24));


			if (days < 0)     { days = -(days + 1);
													seconds = (seconds + 1);   }
			if (hours < 0)    { hours = (-(hours) - 1);    }
			if (hours < 10)   { hours = ('0' + hours);     }
			minutes++;
			if (minutes < 0)  { minutes = -(minutes);      }
			if (minutes < 10) { minutes = ('0' + minutes); }
//			seconds++;
			if (seconds < 0)  { seconds = -(seconds);      }
			if (seconds < 10) { seconds = ('0' + seconds); }

			document.getElementById(element).innerHTML = minutes + ":" + seconds;

			if (distance >= 0) {
				if (focus == true) {
					disableElement('punch-details-content');
					enableElement('punch-details-break');
					focus = false;
					d = new Date();
					l = new Date(d.setMinutes(d.getMinutes()  + breakTime));
				} else {
					disableElement('punch-details-break');
					enableElement('punch-details-content');
					focus = true;
					d = new Date();
					l = new Date(d.setMinutes(d.getMinutes() + focusTime));
				}
			}
		}, 1000);
	}
}

function replaceURLWithHTMLLinks(text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
    return text.replace(exp,"<a target='_blank' href='$1'>$1</a>");
}

function deletePunch(reference) {
	firebase.database().ref('users/' + window.uid + '/punches/' + reference).remove();
}

function showMenu() {
	$( '#new-punch-button' ).removeClass( 'hide' );
}

function hideMenu() {
	$( '#new-punch-button' ).addClass( 'hide' );
}

//function nevermindButton(){
//$( ".form-overlay" ).on('child_changed', function() {

function openDrawer(ref) {
	$( '#' + ref ).css( 'height', '100%' );
}

function closeDrawer(ref) {
	$( '#' + ref ).css( 'height', '0%' );
}

function watchFunctions() {
	$(function() {
		$( ".nevermind" ).on( "click", function() {
			$( this ).closest( '.form-overlay' ).css( 'height', '0%' );
			showMenu();
			watchFunctions();
		});

		$( ".menu-button" ).on( "click", function() {
			openNav();
			watchFunctions();
		});

		$( "#link-new-punch" ).on( "click", function() {
			closeNav();
			genEventForm();
			openDrawer('new-event-wrapper');
			hideMenu();
			watchFunctions();
		});

		$( "#link-new-template" ).on( "click", function() {
			closeNav();
			createTemplateForm();
			openDrawer('template-wrapper');
			hideMenu();
			watchFunctions();
		});
	});
}

/*$(function() {
	$("span").style.on('change',function() {
		console.log("clicked!");
	});
});*/
