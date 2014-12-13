$(document).ready(function() {
    init();
});

var board;

function init() {

    board = new Board();

    board.addPlayer( new Player('Bob') );
    board.addPlayer( new Player('Alice') );

    board.playerTurn();

}