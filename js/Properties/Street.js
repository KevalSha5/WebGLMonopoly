Street.prototype = new GenericProperty();

Street.prototype.constructor = Street;
function Street (name, cost, rent, color) {
	this.name = name;
	this.cost = cost;
	this.rent = rent;
	this.color = color;
}

Street.prototype.payRent = function (player) {
	Bank.handleTransaction(this.owner, player, this.rent);
	console.log("STREET PAY RENT");
}