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
