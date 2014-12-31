Street.prototype = new GenericProperty();

Street.prototype.constructor = Street;
function Street (name, cost, rent, color) {
	this.name = name;
	this.cost = cost;
	this.rent = [rent, 100, 200, 300, 400, 600];
	this.color = color;
	this.houseCost = 200;
	this.mortgageVal = 150;
}

Street.prototype.payRent = function (player) {
	Bank.handleTransaction(this.owner, player, this.rent);
	console.log("STREET PAY RENT");
}