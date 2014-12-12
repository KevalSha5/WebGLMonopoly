function GeneralLandingArea(name) {
    this.name = name;
}

GeneralLandingArea.prototype.land = function () {
    console.log('GeneralLandingArea land function not initialized')
}

GeneralLandingArea.prototype.setLandAction = function (newFunction) {
    this.land = newFunction;
}