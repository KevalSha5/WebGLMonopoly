Utility.prototype = new GenericProperty();

Utility.prototype.constructor = Utility;
function Utility (name, cost, rentFactor) {
	this.name = name;
	this.cost = cost;
	this.rentFactor = [ 4, 10 ];
	this.mortgageVal = 100;
}

Utility.prototype.payRent = function (player) {
	// could be optimized to access the utilities directly
	console.log("UTLITY PAY RENT");

	var utilitiesOwned = 0;

	for (var i = 0; i < board.landables.length; i++) {

		var genericProperty = board.landableAreas[i];

		if ( genericProperty.owner == this.owner 
			 && Object.getPrototypeOf(genericProperty).constructor.name == "Utility" )
			utilitiesOwned++;
	}

	var amountRolled = board.rollDie();
	console.log("For utility rent, player rolled " + amountRolled);

	Bank.handleTransaction(this.owner, player, this.rent[utilitiesOwned - 1] * amountRolled);
}