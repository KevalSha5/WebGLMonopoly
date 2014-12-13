function Bank() {
	var moneyReserve = 30000;
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
		alert("buyer payee does not have enough money");
	}
}

