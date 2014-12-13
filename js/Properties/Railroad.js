Street.prototype = new GenericProperty();

Street.prototype.constructor = Street;
function Street (name, cost) {
	this.name = name;
	this.cost = cost;
}