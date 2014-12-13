Railroad.prototype = new GenericProperty();

Railroad.prototype.constructor = Railroad;
function Railroad (name) {
	this.name = name;
}