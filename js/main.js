$(document).ready(function() {
    init();
});

var board;

function init() {

    board = new Board();

    addLandableAreas();
    addPlayers();

    console.log(boardTheme.landableAreas.length)

    startGameView();

    board.playerTurn();

}

function addLandableAreas() {

    var railroadRent = [25, 50, 100, 200];
    var utilityRent = [4, 10];

    board.addLandableArea( new GenericLandableArea("Go") );
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
    board.addLandableArea( new Utility("Gold Mine", 150, utilityRent) );
    board.addLandableArea( new Street("Khranos", 140, 8) );
    board.addLandableArea( new Street("Amberstill Ranch", 160, 8) );
    board.addLandableArea( new Railroad("Deeprun Tram Irongorge", 200, railroadRent) );
    board.addLandableArea( new Street("Sunstrider Isle", 180, 10) );
    board.addLandableArea( new GenericLandableArea("Community Chest") );
    board.addLandableArea( new Street("Farstrider Retreat", 180, 10) );
    board.addLandableArea( new Street("Fairbreeze Village", 200, 12) );


	board.addLandableArea( new GenericLandableArea("Free Parking") );
    board.addLandableArea( new Street("Valley of Trials", 220, 18) );
    board.addLandableArea( new GenericLandableArea("Chance") );
    board.addLandableArea( new Street("Razor Hill", 220, 18) );
    board.addLandableArea( new Street("The Crossroads", 240, 20 ) );
    board.addLandableArea( new Railroad("Orgrimmar Zeplin") );
    board.addLandableArea( new Street("Nessingwary Expedition", 260, 8) );
    board.addLandableArea( new Street("Venture Co. Base Camp", 260, 8) );
    board.addLandableArea( new Utility("Lumber Mill", 150, utilityRent) );
    board.addLandableArea( new Street("Booty Bay", 280, 8) );


    board.addLandableArea( new GenericLandableArea("Go To Jail") );
    board.addLandableArea( new Street("Dolonar", 300, 8) );
    board.addLandableArea( new Street("Rut'theran Village", 300, 8) );
    board.addLandableArea( new GenericLandableArea("Community Chest") );
    board.addLandableArea( new Street("Darkshore", 320, 8) );
    board.addLandableArea( new Railroad("Zepplin Undercity", 200, railroadRent) );
    board.addLandableArea( new GenericLandableArea("Chance") );
    board.addLandableArea( new Street("Dalaran", 350, 10) );
    board.addLandableArea( new GenericLandableArea("Luxury Tax") );
    board.addLandableArea( new Street("Pandaria", 400, 10) );




}

function addPlayers() {	
    board.addPlayer( new Player('Bob') );
    board.addPlayer( new Player('Alice') );
}