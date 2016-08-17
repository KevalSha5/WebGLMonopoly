function GenericLandableArea (name) {
	this.name = name;
}

var landFunctions = {
	"drawChance": this.drawChance,
	"drawCommunity": this.drawCommunity,
}

GenericLandableArea.prototype.land = function (player) {
	console.log("GENERIC LAND");
	console.log(player.name, 'landed on', this.name);
}

GenericLandableArea.prototype.setLandFunc = function (landFunc) {
	this.land = landFunc;
}

GenericLandableArea.prototype.drawChance = function () {

}