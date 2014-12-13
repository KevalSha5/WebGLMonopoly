function GenericProperty (name) {
	this.name = name;
	this.owner = null;
}

GenericProperty.prototype.land = function (player) {
	console.log(player.name, 'landed on', this.name)

	//if owner lands . . . . do what?

	if (this.owner != null) {

		this.payRent(player);

	} else {

		var buyMsg = player.name + "would you like to buy " + this.name + "for " + this.cost + "?"
		if ( confirm(buyMsg) ){

			Bank.sell(this, player);

		} else {

			alert("auction stub");

		}

	}

}

GenericProperty.prototype.payRent = function () {
	console.log("GENERIC PAY RENT");
}