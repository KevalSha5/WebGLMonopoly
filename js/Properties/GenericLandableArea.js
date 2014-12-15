function GenericLandableArea (name) {
	this.name = name;
}

GenericLandableArea.prototype.land = function (player) {
	console.log("GENERIC LAND");
	console.log(player.name, 'landed on', this.name);
}

GenericLandableArea.prototype.setLandFunc = function (landFunc) {
	this.land = landFunc;
}