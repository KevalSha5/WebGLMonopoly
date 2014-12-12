$(document).ready(function() {
    init();
});



function init() {

    var board = new Board();

    board.addPlayer( new Player('Bob') );
    board.addPlayer( new Player('Alice') );

    board.start();

}