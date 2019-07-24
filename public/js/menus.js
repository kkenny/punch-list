
// menus
function mainMenuDrop() {
	document.getElementById("mainMenuDropdown").classList.toggle("show");
}

function progressMenuDrop(uuid) {
	document.getElementById("progressDropdown" + uuid).classList.toggle("show");
}

function toggleElement(element) {
	document.getElementById(element).classList.toggle("show");
}

window.onclick = function(event) {
	if (!event.target.matches('.dropbtn')) {
		var dropdowns = document.getElementsByClassName("dropdown-content");
		var i;
		for (i = 0; i < dropdowns.length; i++) {
			var openDropdown = dropdowns[i];
			if (openDropdown.classList.contains('show')) {
				openDropdown.classList.remove('show');
			}
		}
	}
}
// end menus //
