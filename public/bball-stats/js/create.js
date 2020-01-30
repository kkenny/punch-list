// function to create game
function newGame(teamHome, teamGuest, homeOrAway, gameDate, gameLocation, gameTime) {

	var newGameKey = firebase.database().ref().child('bball-stats/games').push().key;
	var updates = {};
	updates['bball-stats/games/' + newGameKey] = { teamHome: teamHome, teamGuest: teamGuest, homeOrAway: homeOrAway, gameDate: gameDate, gameTime: gameTime, gameLocation: gameLocation };

	return firebase.database().ref().update(updates);

}

function getGameData() {
	console.log("getting game data");
	var homeTeam = document.getElementById("homeTeam").value;
	var awayTeam = document.getElementById("awayTeam").value;
	var homeOrAway = document.getElementById("homeOrAway").value;
	var gameLocation = document.getElementById("gameLocation").value;
	var gameDate = document.getElementById("gameDate").value;
	var gameTime = document.getElementById("gameTime").value;

	// TODO: Need to add error checking

	newGame(homeTeam, awayTeam, homeOrAway, gameDate, gameLocation, gameTime);
	window.location.href = '/';
}

