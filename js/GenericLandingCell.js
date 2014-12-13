function GenericLandingCell (name) {
	this.name = name;
}

GenericLandingCell.prototype.land = function (player) {
	console.log(player.name, "landed on ", this.name);
}

//Subclass Street
Street.prototype = new GenericLandingCell();
Street.prototype.constructor = Street;
function Street (name) {
	this.name = name;
}

Railroad.prototype = new GenericLandingCell();
Railroad.prototype.constructor = Railroad;
function Railroad (name) {
	this.name = name;
}