Utility.prototype = new GenericProperty();

Utility.prototype.constructor = Utility;
function Utility (name, cost) {
	this.name = name;
	this.cost = cost;
}