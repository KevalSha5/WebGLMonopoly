function Bank() {

	var moneyReserve = 30000;
	// AUCTION BUTTON EVENT LISTENRS
	$( "#auction-window-button-leave" ).on( "mousedown", endAuction );
}

Bank.sell = function (property, buyer) {
	if (buyer.money >= property.cost) {
		buyer.money -= property.cost;
		property.owner = buyer;
		console.log(buyer.name, "now owns", property.name);
	} else {
		alert("buyer does not have enough money");
	}
}

Bank.handleTransaction = function (reciever, payee, amount) {

	console.log("TRANSACTION", payee.name, "pays", reciever.name, amount )

	if (payee.money >= amount) {
		payee.money -= amount;
		reciever.money += amount;
	} else {
		alert(" payee does not have enough money");
	}

}



var updateInterval;
Bank.auction = function ( property ) {

	UI.auction( property );
	return;

	// PAUSE GUI / GAME
    $("#modal-background").toggleClass("active");
    $("#modal-auction-window").toggleClass("active");
    controls.enabled = false;

    var seconds = 0;
    var timeLimit = 15;
    var timeRemaining = timeLimit;

	var updateAuctionTimer = function () {		
		$("#auction-window-bid-info").html( timeRemaining-- + " second(s) remaing.");
		if (timeRemaining == 0) endAuction();
	}


	updateInterval = setInterval( updateAuctionTimer, 1000 );


	return null; // NEED TO RETURN WINNER
    
	
}


var endAuction = function () {
	window.clearInterval( updateInterval );
	$("#auction-window-bid-info").html( "Auction has ended" );


    // REANABLE GUI/GAME
    controls.enabled = true;
    $("#modal-auction-window").toggleClass("active");
    $("#modal-background").toggleClass("active");
}