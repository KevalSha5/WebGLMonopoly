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

