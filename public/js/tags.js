// tags
function clearTagFilter() {
	conLog("clearing tags");

	$( "li" )
		.removeClass( "hide" );
document.getElementById('clear-tags-div').innerHTML = '';
}

function tagFilter(reference) {
	conLog("Filtering Punches on: " + reference);

	$( "li" )
		.addClass( "hide" );

	$( "." + reference )
		.closest( "li" )
		.removeClass( "hide" );

document.getElementById('clear-tags-div').innerHTML = "<a class='punch-default u-pull-right' href='#' onClick=clearTagFilter()>Clear Tags</a>";
}
