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

    this.landableAreas.push( new Property("Northshire Abbey", 100) );
    this.landableAreas.push( new Property("Goldshire", 150) );
    this.landableAreas.push( new Property("Lakeshire", 200) );
    this.landableAreas.push( new Property("Moonbrook", 250) );
    this.landableAreas.push( justVisitingJail );
    this.landableAreas.push( freeParking );
}

Board.prototype.addPlayer = function (player) {
    this.players.push(player);
    player.pos = 0;
    console.log(player.name, "has joined the game");
}

Board.prototype.start = function () {

    var diceRoll1 = Math.ceil( Math.random() * 6 );
    var diceRoll2 = Math.ceil( Math.random() * 6 );
    var moveAmount = diceRoll1 + diceRoll2;

    var currentPlayer = this.players[0];
    var newPos = (currentPlayer.pos + diceRoll1 + diceRoll2) % 5;
    currentPlayer.pos = newPos;
    this.landableAreas[newPos].land( currentPlayer );
}

Board.prototype.getLandableAreaCount = function () {
    return this.landableAreas.length;
}