
function UI () {
}

UI.init = function () {
	this.pos = {x: 0, y: 0};
	this.showTooltip = false;

	$("#ui-tooltip").show();
}

UI.alert = function ( msg ) {

	var alert = $("<div/>").addClass("ui-alert-msg").text( msg ).show().delay( 2000 ).fadeOut( 1500, destroyElement );
	$( "#ui-alert-box" ).append( alert );

}

UI.status = function ( msg ) {

	$( "#ui-status" ).text( msg );

}

UI.tooltip = function ( obj ) {

	if ( obj === undefined ) return;
	else fillContent( $("#ui-tooltip"), obj )


}

UI.auction = function ( property ) {

	removeListeners();
	$("#ui-modal-wrapper").fadeIn(1000);
	$("#ui-auction-window").fadeIn(1500);
	$("#ui-auction-window").addClass("ui-window");

	fillContent( $("#ui-auction-property-info"), property );

	var seconds = 0;
	var currentBid = 0;
	var highestBidder = "No Bids Yet";

	var bidAmountField;
	var bidButton;

	var preRunTime = 5;
	var runTime = 15 + preRunTime;
	var postRunTime = 3 + runTime;

	var preRun = function () {
		$("#ui-auction-bid-info").find("h1").text("Auction starts in " + (preRunTime - seconds) + " seconds.")
	}

	var run = function () {
		$("#ui-auction-bid-info").find("h1").text( runTime - seconds + " seconds remaining." );
		$("#ui-auction-current-bid").text( "Current bid is $" + currentBid );
		$("#ui-auction-highest-bidder").text( highestBidder );
	}

	var postRun = function () {

		// TODO - No one bids, no one wins
		$("#ui-auction-bid-info").find("h1").text( highestBidder + " has won." ); 
	}

	var timer = setInterval( function () {

		if ( seconds < preRunTime ) preRun();
		else if ( seconds < runTime ) run();
		else if ( seconds < postRunTime ) postRun();
		else {
			clearInterval( timer );
			$("#ui-modal-wrapper").fadeOut(1000);
			$("#ui-auction-window").fadeOut(1500);
		}

		seconds++;
	
	},
	1000);

}

UI.update = function () {
	
	if ( this.showTooltip ) {
		$("#ui-tooltip").show();
		$("#ui-tooltip").offset( { left: this.pos.x + 40, top:  this.pos.y - 240 } ); 
	} else {
		$("#ui-tooltip").hide();
	}

}

function fillContent ( element, obj ) {

	clearElement( element );

	if ( obj instanceof Street ) 		fillWithStreet( element, obj )
	else if ( obj instanceof Railroad ) fillWithRailroad( element, obj )
	else if ( obj instanceof Utility )  fillWithUtility( element, obj )
	else								stashElement( element )

}

function fillWithStreet ( element, street ) {

	var genPropDiv    = $("<div/>").addClass( "ui-content-generic-property");
	var streetDiv     = $("<div/>").addClass( "ui-content-street" );
	var streetNameDiv = $("<div/>").addClass( "ui-content-street-name-wrapper" );

	streetNameDiv.append( "<h2>" + "Title Deed" + "</h2>" )
	streetNameDiv.append( "<h1>" + street.name + "</h1>")
	streetNameDiv.css("background-color",street.color);


	streetDiv.append( streetNameDiv );
	streetDiv.append( 
		"<table>" +

			"<tr>" +
				"<td align='center' colspan='2'>" + "RENT: $" + street.rent[0] + "</td>" +
			"</tr>" +
			"<tr>"  +
				"<td align='left'>"  + "With 1 House:"      + "</td>" +
				"<td align='right'>" + "$" + street.rent[1] + "</td>" +
			"</tr>" +
			"<tr>"  +
				"<td align='left'>"  + "With 2 Houses:"      + "</td>" +
				"<td align='right'>" + " " + street.rent[2]  + "</td>" +
			"</tr>" +
			"<tr>"  +
				"<td align='left'>"  + "With 3 Houses:"      + "</td>" +
				"<td align='right'>" + " " + street.rent[3]  + "</td>" +
			"</tr>" +
			"<tr>"  +
				"<td align='left'>"  + "With 4 Houses:"      + "</td>" +
				"<td align='right'>" + " " + street.rent[4]  + "</td>" +
			"</tr>" +
			"<tr>" +
				"<td align='center' colspan='2'>" + "With HOTEL: $" + street.rent[5] + "</td>" +
			"</tr>" +
			"<tr>" +
				"<td align='center' colspan='2'>" + "Mortgage Value: $" + street.mortgageVal + "</td>" +
			"</tr>" +
			"<tr>" +
				"<td align='center' colspan='2'>" + "Houses Cost: $" + street.houseCost + " each" + "</td>" +
			"</tr>" +
			"<tr>" +
				"<td align='center' colspan='2'>" + "Hotels, $" + street.houseCost + " plus 4 houses" + "</td>" +
			"</tr>" +

		"</table>"
	);

	genPropDiv.append( streetDiv );
	element.append( genPropDiv );
}

function fillWithRailroad ( element, railroad ) {

	var genPropDiv  = $("<div/>").addClass( "ui-content-generic-property");
	var railroadDiv = $("<div/>").addClass( "ui-content-railroad" );

	var table, row, cell1;
	table = $("<table></table>").appendTo( railroadDiv );

	row = $("<tr></tr>");
	$("<td></td>").attr( { align: "center", colspan: "2" } ).text("Railroad Image").appendTo( row );
	row.appendTo( table );

	row = $("<tr></tr>");
	$("<td></td>").attr( { align: "center", colspan: "2" } ).text( railroad.name ).appendTo( row );
	row.appendTo( table );

	row = $("<tr></tr>");
	$("<td></td>").attr( { align: "left" } ).text("Rent").appendTo( row );
	$("<td></td>").attr( { align: "right" } ).text( "$" + railroad.rent[0] ).appendTo( row );
	row.appendTo( table );

	row = $("<tr></tr>");
	$("<td></td>").attr( { align: "left" } ).text( "If 2 R.R.'s are owned" ).appendTo( row );
	$("<td></td>").attr( { align: "right" } ).text( railroad.rent[1] ).appendTo( row );
	row.appendTo( table );

	row = $("<tr></tr>");
	$("<td></td>").attr( { align: "left" } ).text( "If 3 R.R.'s" ).appendTo( row );
	$("<td></td>").attr( { align: "right" } ).text( railroad.rent[2] ).appendTo( row );
	row.appendTo( table );

	row = $("<tr></tr>");
	$("<td></td>").attr( { align: "left" } ).text( "If 4 R.R.'s" ).appendTo( row );
	$("<td></td>").attr( { align: "right" } ).text( railroad.rent[3] ).appendTo( row );
	row.appendTo( table );

	row = $("<tr></tr>");
	$("<td></td>").attr( { align: "left", valign: "bottom" } ).text( "Mortgage Value" ).appendTo( row );
	$("<td></td>").attr( { align: "right", valign: "bottom" } ).text( railroad.mortgageVal ).appendTo( row );
	row.appendTo( table );

	genPropDiv.append( railroadDiv )
	element.append( genPropDiv );

}

function fillWithUtility ( element, utility ) {

	var genPropDiv = $("<div/>").addClass( "ui-content-generic-property");
	var utilityDiv = $("<div/>").addClass( "ui-content-railroad" );

	var message = "If {0} owned rent is {1} times the amount shown on dice";

	var table, row;
	table = $("<table></table>").appendTo( utilityDiv );

	row = $("<tr></tr>");
	$("<td></td>").attr( { align: "center", colspan: "2" } ).text("Utility Image").appendTo( row );
	row.appendTo( table );

	row = $("<tr></tr>");
	$("<td></td>").attr( { align: "center", colspan: "2" } ).text( utility.name ).appendTo( row );
	row.appendTo( table );

	row = $("<tr></tr>");
	$("<td></td>").attr( { align: "center", colspan: "2" } ).text( message.format( "one \"Utility\" is", utility.rentFactor[0] ) ).appendTo( row );
	row.appendTo( table );

	row = $("<tr></tr>");
	$("<td></td>").attr( { align: "center", colspan: "2" } ).text( message.format( "both \"Utilities\" are", utility.rentFactor[1] ) ).appendTo( row );
	row.appendTo( table );

	row = $("<tr></tr>");
	$("<td></td>").attr( { align: "left", valign: "bottom" } ).text( "Mortgage Value" ).appendTo( row );
	$("<td></td>").attr( { align: "right", valign: "bottom" } ).text( "$" + utility.mortgageVal ).appendTo( row );
	row.appendTo( table );

	genPropDiv.append( utilityDiv )
	element.append( genPropDiv );

}

function stashElement ( element ) {
	clearElement( element )
	element.hide();
}

function clearElement ( element ) {
	element.html("");
	element.removeClass();
}

function destroyElement () {
	$(this).remove();
}