// function to create game
function newGame(teamHome, teamGuest, homeOrAway, gameDate, gameLocation, gameTime) {

	var newGameKey = firebase.database().ref().child('bball-stats/games').push().key;
	var updates = {};
	updates['bball-stats/games/' + newGameKey] = { teamHome: teamHome, teamGuest: teamGuest, homeOrAway: homeOrAway, gameDate: gameDate, gameTime: gameTime, gameLocation: gameLocation };

	return firebase.database().ref().update(updates);
}

function getGameData() {
	var homeTeam = document.getEementById("homeTeam").value;
	var awayTeam = document.getEementById("awayTeam").value;
	var homeOrAway = document.getEementById("homeOrAway").value;
	var gameLocation = document.getEementById("gameLocation").value;
	var gameDate = document.getEementById("gameDate").value;
	var gameTime = document.getEementById("gameTime").value;

	// TODO: Need to add error checking

	newGame(homeTeam, awayTeam, homeOrAway, gameDate, gameLocation, gameTime);
}

