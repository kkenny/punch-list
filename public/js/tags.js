// tags
function clearTagFilter() {
	conLog("clearing tags");

	$( "li" )
		.removeClass( "hide" );
}

function tagFilter(reference) {
	conLog("Filtering Punches on: " + reference);

	$( "li" )
		.addClass( "hide" );

	$( "." + reference )
		.closest( "li" )
		.removeClass( "hide" );
}
