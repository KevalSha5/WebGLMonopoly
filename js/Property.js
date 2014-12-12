function Property(name) {
    this.name = name;    
}

Property.prototype.getName = function () {
    return this.name;
}

Property.prototype.land = function (player) {
    console.log(player.name, 'landed on', this.name);
}