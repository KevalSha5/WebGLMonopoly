$(document).ready(function() {
    init();
});

var board;

function init() {

    // Need to put this else where
    if (!String.prototype.format) {
      String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) { 
          return typeof args[number] != 'undefined'
            ? args[number]
            : match
          ;
        });
      };
    }
    //----------------------

    board = new Board();    
    // ui = new UI();
    UI.init();

    loadBoardTheme();
    // addLandableAreas();
    // exportCurrentTheme();

    console.log( board.landables )

    addPlayers();
    addDie();

    // console.log(boardTheme.landableAreas.length)

    startGameView();

    // board.playerTurn();

}

function exportCurrentTheme () {

    var boardTheme = {};
    boardTheme.info = null;
    boardTheme.landables = [];

    for ( var i in board.landables ) {

        boardTheme.landables[i] = {};

        var type = board.landables[i].constructor.name.toString();
        boardTheme.landables[i].type = type;

        for ( var key in board.landables[i] ) {
            if ( board.landables[i].hasOwnProperty( key ) )
                boardTheme.landables[i][key] = board.landables[i][key];
        }
    }

    localStorage.setItem("theme", JSON.stringify(boardTheme));
}

function loadBoardTheme () {

    var uL = boardtheme.landables; //unthemed landable ( from theme.js )
    var tL; // themed landable

    for ( var i in uL ) {

        tL = new window[ uL[i].type ]

        for ( var key in uL[i] )
            if ( uL[i].hasOwnProperty( key ) )
                tL[key] = uL[i][key];

        board.addLandableArea( tL );
    }

}

function addLandableAreas() {

    var railroadRent = [25, 50, 100, 200];
    var utilityRent = [4, 10];

    board.addLandableArea( new GenericLandableArea("Go") );
	board.addLandableArea( new Street("Northshire\nAbbey", 60, 2, "#955436") );
	board.addLandableArea( new GenericLandableArea("Community\nChest") );
    board.addLandableArea( new Street("Goldshire", 60, 4, "#955436") );
	board.addLandableArea( new GenericLandableArea("Income Tax") );
    board.addLandableArea( new Railroad("Deeprun Tram\n Stormwind", 200, railroadRent) );
    board.addLandableArea( new Street("Deathknell", 100, 6, "#A8E2F8") );
	board.addLandableArea( new GenericLandableArea("Chance") );
    board.addLandableArea( new Street("Brill", 100, 6, "#A8E2F8") );
    board.addLandableArea( new Street("The Speculcher", 120, 8, "#A8E2F8") );
    

    board.addLandableArea( new GenericLandableArea("Just Visiting /\nGo To Jail") );
    board.addLandableArea( new Street("Anvilmar", 140, 8, "#D93A96") );
    board.addLandableArea( new Utility("Gold Mine", 150, utilityRent) );
    board.addLandableArea( new Street("Khranos", 140, 8, "#D93A96") );
    board.addLandableArea( new Street("Amberstill\nRanch", 160, 8, "#D93A96") );
    board.addLandableArea( new Railroad("Deeprun Tram\nIrongorge", 200, railroadRent) );
    board.addLandableArea( new Street("Sunstrider Isle", 180, 10, "#F7941D") );
    board.addLandableArea( new GenericLandableArea("Community\nChest") );
    board.addLandableArea( new Street("Farstrider\nRetreat", 180, 10, "#F7941D") );
    board.addLandableArea( new Street("Fairbreeze\nVillage", 200, 12, "#F7941D") );


    board.addLandableArea( new GenericLandableArea("Free Parking") );
    board.addLandableArea( new Street("Valley of Trials", 220, 18, "#ED1B24") );
    board.addLandableArea( new GenericLandableArea("Chance") );
    board.addLandableArea( new Street("Razor Hill", 220, 18, "#ED1B24") );
    board.addLandableArea( new Street("The Crossroads", 240, 20, "#ED1B24" ) );
    board.addLandableArea( new Railroad("Orgrimmar\nZeplin") );
    board.addLandableArea( new Street("Nessingwary\nExpedition", 260, 8, "#FEF200") );
    board.addLandableArea( new Street("Venture Co.\nBase Camp", 260, 8, "#FEF200") );
    board.addLandableArea( new Utility("Lumber Mill", 150, utilityRent) );
    board.addLandableArea( new Street("Booty Bay", 280, 8, "#FEF200") );


    board.addLandableArea( new GenericLandableArea("Go To Jail") );
    board.addLandableArea( new Street("Dolonar", 300, 8, "#1FB25A" ) );
    board.addLandableArea( new Street("Rut'theran\nVillage", 300, 8, "#1FB25A") );
    board.addLandableArea( new GenericLandableArea("Community\nChest") );
    board.addLandableArea( new Street("Darkshore", 320, 8, "#1FB25A") );
    board.addLandableArea( new Railroad("Zepplin\nUndercity", 200, railroadRent) );
    board.addLandableArea( new GenericLandableArea("Chance") );
    board.addLandableArea( new Street("Dalaran", 350, 10, "#0072BB") );
    board.addLandableArea( new GenericLandableArea("Luxury Tax") );
    board.addLandableArea( new Street("Pandaria", 400, 10, "#0072BB") );




}

function addPlayers() {	
    board.addPlayer( new Player('Bob') );
    board.addPlayer( new Player('Alice') );
}

function addDie() {
    board.die = new Die( 2, 6 );
}
