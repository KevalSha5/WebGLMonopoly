function Board() {
    this.players = [];
    this.landableAreas = [];

    var justVisitingJailLandFunc = function () {
        console.log("no worries, you're just visiting jail :)");
    }

    var justVisitingJail = new GeneralLandingArea("Just visiting");
    justVisitingJail.setLandAction(justVisitingJailLandFunc);

    var freeParkingFunc = function () {
        console.log("free parking! :D");
    }

    var freeParking = new GeneralLandingArea("Free Parking");
    freeParking.setLandAction(freeParkingFunc);

    this.landableAreas.push( new Property("Northshire Abbey") );
    this.landableAreas.push( new Property("Goldshire") );
    this.landableAreas.push( new Property("Lakeshire") );
    this.landableAreas.push( new Property("Moonbrook") );
    this.landableAreas.push( justVisitingJail );
    this.landableAreas.push( freeParking );
}

Board.prototype.addPlayer = function (player) {
    this.players.push(player);
    player.setPos(0);
    console.log(player.name, "has joined the game");
}

Board.prototype.start = function () {

    var diceRoll1 = Math.ceil( Math.random() * 6 );
    var diceRoll2 = Math.ceil( Math.random() * 6 );

    var currentPlayer = this.players[0];
    var newPos = (currentPlayer.getPos() + diceRoll1 + diceRoll2) % 5;
    this.landableAreas[newPos].land( currentPlayer );
}