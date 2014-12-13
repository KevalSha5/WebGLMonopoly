function Board() {
    this.players = [];
    this.currentPlayerIndex = 0;
    this.landableAreas = [];

    this.landableAreas.push( new Street("Northshire Abbey", 60) );
    this.landableAreas.push( new Street("Goldshire", 60) );

    this.landableAreas.push( new Railroad("Deeprun Tram", 200) );

    this.landableAreas.push( new Street("Deathknell", 100) );
    this.landableAreas.push( new Street("Brill", 100) );
    this.landableAreas.push( new Street("The Speculcher", 120) );

    this.landableAreas.push( new Utility("Lumber Mill", 150) );

}

Board.prototype.addPlayer = function (player) {
    this.players.push(player);
    player.pos = 0;
    console.log(player.name, "has joined the game");
}

Board.prototype.playerTurn = function () {

    var diceRoll1 = Math.ceil( Math.random() * 6 );
    var diceRoll2 = Math.ceil( Math.random() * 6 );
    var moveAmount = diceRoll1 + diceRoll2;

    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    var currentPlayer = this.players[ this.currentPlayerIndex ];
    var newPos = (currentPlayer.pos + diceRoll1 + diceRoll2) % this.landableAreas.length;
    currentPlayer.pos = newPos;
    this.landableAreas[newPos].land( currentPlayer );
}

Board.prototype.getLandableAreaCount = function () {
    return this.landableAreas.length;
}