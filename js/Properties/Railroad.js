Railroad.prototype = new GenericProperty();

Railroad.prototype.constructor = Railroad;
function Railroad (name, cost, rent) {
	this.name = name;
	this.cost = cost;
	this.rent = rent;
}

Railroad.prototype.payRent = function (player) {
	console.log("RAILROAD PAY RENT");

	var railroadsOwned = 0;

	for (var i = 0; i < board.landableAreas.length; i++) {

		var genericProperty = board.landableAreas[i];

		if ( genericProperty.owner == this.owner 
			 && Object.getPrototypeOf(genericProperty).constructor.name == "Railroad" )
			railroadsOwned++;
	}

	Bank.handleTransaction(this.owner, player, this.rent[railroadsOwned - 1]);
}