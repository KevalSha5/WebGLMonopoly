function Board() {
    this.players = [];
    this.currentPlayerIndex = 0;
    this.landableAreas = [];
}

Board.prototype.addLandableArea = function (landableArea) {
    this.landableAreas.push(landableArea);
}

Board.prototype.addPlayer = function (player) {
    this.players.push(player);
    player.pos = 0;
    console.log(player.name, "has joined the game");
}

Board.prototype.start = function () {
    for (var func in Rules.ON_START) {
        func();
    }
}

Board.prototype.playerTurn = function () {

    
    var moveAmount = this.rollDie();

    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    var currentPlayer = this.players[ this.currentPlayerIndex ];

    var newPos = (currentPlayer.pos + moveAmount) % this.landableAreas.length;
    currentPlayer.pos = newPos;
    this.landableAreas[newPos].land( currentPlayer );

    console.log(this.players)
    console.log("\n")

}

Board.prototype.rollDie = function () {
    var diceRoll1 = Math.ceil( Math.random() * 6 );
    var diceRoll2 = Math.ceil( Math.random() * 6 );
    return diceRoll1 + diceRoll2;
}

Board.prototype.getLandableAreaCount = function () {
    return this.landableAreas.length;
}