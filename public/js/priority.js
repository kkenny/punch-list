// prioritization position loop
function positionLoop() {
	$( "li" ).each(function( i, l ){
		var punchRef = firebase.database().ref('users/' + uid + '/punches/' + l.id + '/priority');
		punchRef.once('value').then(function(snapshot) {
			var cPriority = snapshot.val();
			var nPriority = i;

			if ( parseInt(cPriority) < 100 ) {
				conLog("Updating: " + l.id + " priority, from: " + cPriority + ", to: " + nPriority);
				setPriority(l.id, nPriority);
			}
		});
		//conLog("i: " + i + " l: " + l.id);
	});
}

// set priority for a punch
function setPriority(sortObject, newPosition) {
	conLog("function: setPriority(" + sortObject + ", " + newPosition + ")");

	var priority = {};

	priority['users/' + window.uid + '/punches/' + sortObject + '/priority' ] = parseInt(newPosition);

	firebase.database().ref().update(priority);

	$( '#' + sortObject).attr("priority", newPosition);
}

