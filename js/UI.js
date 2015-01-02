
function UI () {
}

UI.init = function () {
	this.pos = {x: 0, y: 0};
	this.showTooltip = false;

	$("#ui-tooltip").show();
}

UI.alert = function ( msg ) {

	// need destroyElement() ???
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

UI.propertyOptions = function ( property ) {

	$("#ui-modal-wrapper").show();
	$("#ui-property-options").show();
	removeListeners();

	if ( player == property.owner ) {
		$("#ui-property-options").text("Showing developmental options");
		
	}

	var okButton = $("#ui-property-options").find(":button").bind( "click", function () {

		$("#ui-modal-wrapper").hide();
		$("#ui-property-options").hide();
		addListeners();

	});




	// if owned by player
		// add hotel/house option
		// sell hotel/house option
		// mortgage option
	// else
		// offer option

}

UI.auction = function ( property ) {

	removeListeners();
	$("#ui-modal-wrapper").fadeIn(1000);
	$("#ui-auction-window").fadeIn(1500);
	// $("#ui-auction-window").addClass("ui-window");

	fillContent( $("#ui-auction-property-info"), property );
	/*
		TODO - Right below the property info, need to add information
		about the other property of similar types.
		i.e. for a railroad, show the owners of other railroads (if any)
		i.e. for an orange street, show who owns other orange streets
		Format it so only the title of the property and the owner is shown
	*/

	var seconds = 0;
	var currentBid = 0;
	var highestBidder = "No Bids Yet";

	var bidButton = $("#ui-auction-bid-control").find(":button");
	var bidTextfield = $("#ui-auction-bid-control").find(":input");
	
	bidButton.bind( "click", function() {
		/*
		 	TODO - Make the bid function go through Bank object
		*/
		currentBid = bidTextfield.val();
	});

	var preRunTime = 4;
	var runTime = 15 + preRunTime;
	var postRunTime = 4 + runTime;

	var preRun = function () {
		$("#ui-auction-bid-info").find("h1").text("Auction starts in " + (preRunTime - seconds) + " seconds.")
	}

	var run = function () {
		/*
			TODO - Need to update highest bidder & bid in real time
		*/
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
			$("#ui-auction-window").removeClass("ui-window");
			addListeners();
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
	/*
		TODO - Instead of using append() below to change the html,
		use pure jQuery ( like it's done in fillWithRailroad()
		& fillWithUtility() to change the html)
	*/
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

	var table, row;
	table = $("<table></table>").appendTo( railroadDiv );

	/*
		TODO - Needs a little better formatting to 
		better resemble actual card 
		Also need to add railroad icon/image
	*/
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

	/*
		TODO - Needs a little better formatting to 
		better resemble actual card 
		Also need to add utility icon/image
	*/
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