function Player(name) {
    this.name = name;
    this.pos = 0;
}

Player.prototype.getName = function () {
    return this.name;
}

Player.prototype.move = function (num) {
    return this.pos += num;
}

Player.prototype.setPos = function (num) {
    this.pos = num;
}

Player.prototype.getPos = function () {
    return this.pos;
}