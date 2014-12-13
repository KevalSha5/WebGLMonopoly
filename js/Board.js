function Board() {
    this.players = [];
    this.landableAreas = [];

    this.landableAreas.push( new Street("Northshire Abbey") );
    this.landableAreas.push( new Street("Goldshire") );

    this.landableAreas.push( new Railroad("Deeprun Tram") );

    this.landableAreas.push( new Street("Deathknell") );
    this.landableAreas.push( new Street("Brill") );
    this.landableAreas.push( new Street("The Speculcher") );

    this.landableAreas.push( new Utility("Lumber Mill") );

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
    var newPos = (currentPlayer.pos + diceRoll1 + diceRoll2) % this.landableAreas.length;
    currentPlayer.pos = newPos;
    this.landableAreas[newPos].land( currentPlayer );

}

Board.prototype.getLandableAreaCount = function () {
    return this.landableAreas.length;
}