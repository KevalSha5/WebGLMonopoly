function Die ( num, range ) {
	console.log( "New Die Created" );	
}

Die.prototype.roll = function () {
	return Math.ceil( Math.random() * 6 ) + Math.ceil( Math.random() * 6 );
	console.log(" Rollling ");
}