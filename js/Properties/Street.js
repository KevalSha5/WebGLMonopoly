Street.prototype = new GenericProperty();

Street.prototype.constructor = Street;
function Street (name, cost, rent) {
	this.name = name;
	this.cost = cost;
	this.rent = rent;
}

Street.prototype.payRent = function (player) {
	Bank.handleTransaction(this.owner, player, this.rent);
	console.log("STREET PAY RENT");
}