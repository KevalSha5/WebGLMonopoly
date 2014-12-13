function GenericProperty (name) {
	this.name = name;
}

GenericProperty.prototype.land = function (player) {
	console.log(player.name, 'landed on', this.name)
}