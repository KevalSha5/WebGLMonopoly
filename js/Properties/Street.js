Street.prototype = new GenericProperty();

Street.prototype.constructor = Street;
function Street (name) {
	this.name = name;
}