$(document).ready(function() {
    init();
});

var board;

function init() {

    board = new Board();

    addLandableAreas();
    addPlayers();

    board.playerTurn();

}

function addLandableAreas() {

    var railroadRent = [25, 50, 100, 200];
    var utilityRent = [4, 10];

	board.addLandableArea( new Street("Northshire Abbey", 60, 2) );
	board.addLandableArea( new GenericLandableArea("Community Chest") );
    board.addLandableArea( new Street("Goldshire", 60, 4) );
	board.addLandableArea( new GenericLandableArea("Income Tax") );
    board.addLandableArea( new Railroad("Deeprun Tram Stormwind", 200, railroadRent) );
    board.addLandableArea( new Street("Deathknell", 100, 6) );
    board.addLandableArea( new Street("Brill", 100, 6) );
	board.addLandableArea( new GenericLandableArea("Chance") );
    board.addLandableArea( new Street("The Speculcher", 120, 8) );
	board.addLandableArea( new GenericLandableArea("Just Visiting / Go To Jail") );


    board.addLandableArea( new Street("Anvilmar", 140, 8) );
    board.addLandableArea( new Street("Khranos", 140, 8) );
    board.addLandableArea( new Street("Amberstill Ranch", 160, 8) );



    board.addLandableArea( new Street("Dolonar", 140, 8) );
    board.addLandableArea( new Utility("Lumber Mill", 150, utilityRent) );
    board.addLandableArea( new Street("Rut'theran Village", 140, 8) );
    board.addLandableArea( new Street("Darkshore", 160, 8) );
    board.addLandableArea( new Street("Deeprun Tran Irongorge", 160, 8) );

}

function addPlayers() {	
    board.addPlayer( new Player('Bob') );
    board.addPlayer( new Player('Alice') );
}