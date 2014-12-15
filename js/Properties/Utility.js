Utility.prototype = new GenericProperty();

Utility.prototype.constructor = Utility;
function Utility (name, cost, rent) {
	this.name = name;
	this.cost = cost;
	this.rent = rent;
}

Utility.prototype.payRent = function (player) {
	// could be optimized to access the utilities directly
	console.log("UTLITY PAY RENT");

	var utilitiesOwned = 0;

	for (var i = 0; i < board.landableAreas.length; i++) {

		var genericProperty = board.landableAreas[i];

		if ( genericProperty.owner == this.owner 
			 && Object.getPrototypeOf(genericProperty).constructor.name == "Utility" )
			utilitiesOwned++;
	}

	var amountRolled = board.rollDie();
	console.log("For utility rent, player rolled " + amountRolled);

	Bank.handleTransaction(this.owner, player, this.rent[utilitiesOwned - 1] * amountRolled);
}