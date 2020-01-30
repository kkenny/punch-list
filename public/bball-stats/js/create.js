// function to create game
function newGame(teamHome, teamGuest, homeOrAway, gameDate, gameLocation, gameTime) {

	var newGameKey = firebase.database().ref().child('bball-stats/games').push().key;
	var updates = {};
	updates['bball-stats/games/' + newGameKey] = { teamHome: teamHome, teamGuest: teamGuest, homeOrAway: homeOrAway, gameDate: gameDate, gameTime: gameTime, gameLocation: gameLocation };

	return firebase.database().ref().update(updates);

}

function getGameData() {
	console.log("getting game data");
	var homeTeam = document.getElementByName("homeTeam").value;
	var awayTeam = document.getElementByName("awayTeam").value;
	var homeOrAway = document.getElementByName("homeOrAway").value;
	var gameLocation = document.getElementByName("gameLocation").value;
	var gameDate = document.getElementByName("gameDate").value;
	var gameTime = document.getElementByName("gameTime").value;

	// TODO: Need to add error checking

	newGame(homeTeam, awayTeam, homeOrAway, gameDate, gameLocation, gameTime);
	window.location.href = '/';
}

