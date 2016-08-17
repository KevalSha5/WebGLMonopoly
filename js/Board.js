function Board() {
    this.players = [];
    this.landables = [];
    this.turn = 0;
    this.die;
    new Bank();
}

Board.prototype.addLandableArea = function (landableArea) {
    this.landables.push(landableArea);
}

Board.prototype.addPlayer = function (player) {
    this.players.push(player);
    player.pos = 0;
    console.log(player.name, "has joined the game");
}

Board.prototype.start = function () {



}

Board.prototype.playerTurn = function () {

    
    var moveAmount = this.rollDie();

    this.turn++;
    var currentPlayer = this.players[ this.turn % this.players.length ];

    var newPos = (currentPlayer.pos + moveAmount) % this.landables.length;
    currentPlayer.pos = newPos;
    this.landables[newPos].land( currentPlayer );


    console.log(this.players)
    console.log("\n")

}

Board.prototype.rollDie = function () {
    var diceRoll1 = Math.ceil( Math.random() * 6 );
    var diceRoll2 = Math.ceil( Math.random() * 6 );
    return diceRoll1 + diceRoll2;
}

Board.prototype.getLandableAreaCount = function () {
    return this.landables.length;
}