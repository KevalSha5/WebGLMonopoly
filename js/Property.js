function Property(name, cost) {
    this.name = name;
    this.owner = null;
    this.cost = cost;
}

Property.prototype.getName = function () {
    return this.name;
}

Property.prototype.land = function (player) {
    console.log(player.name, 'landed on', this.name);

    if (this.owner) {

    	//pay up

    } else {

    	//prompt player to buy
    	if ( confirm(player.name + ", would you like to buy " + this.name + "?") ) {

    		Bank.sell(this, player);


    	} else {
    	//if player doesn't buy, auction


    	}


    }

}