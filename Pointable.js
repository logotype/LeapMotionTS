var vectorModule = require('./Vector3')



var Pointable = (function () {
    function Pointable() {
        this.length = 0;
        this.width = 0;
        this.direction = vectorModule.Vector3.invalid();
        this.tipPosition = vectorModule.Vector3.invalid();
        this.tipVelocity = vectorModule.Vector3.invalid();
    }
    Pointable.prototype.isValid = function () {
        var returnValue = false;
        if((this.direction && this.direction.isValid()) && (this.tipPosition && this.tipPosition.isValid()) && (this.tipVelocity && this.tipVelocity.isValid())) {
            returnValue = true;
        }
        return returnValue;
    };
    Pointable.prototype.isEqualTo = function (other) {
        var returnValue = true;
        if(!this.isValid() || !other.isValid()) {
            returnValue = false;
        }
        if(returnValue && this.frame != other.frame) {
            returnValue = false;
        }
        if(returnValue && this.hand != other.hand) {
            returnValue = false;
        }
        if(returnValue && !this.direction.isEqualTo(other.direction)) {
            returnValue = false;
        }
        if(returnValue && this.length != other.length) {
            returnValue = false;
        }
        if(returnValue && this.width != other.width) {
            returnValue = false;
        }
        if(returnValue && this.id != other.id) {
            returnValue = false;
        }
        if(returnValue && !this.tipPosition.isEqualTo(other.tipPosition)) {
            returnValue = false;
        }
        if(returnValue && !this.tipVelocity.isEqualTo(other.tipVelocity)) {
            returnValue = false;
        }
        if(this.isFinger != other.isFinger || this.isTool != other.isTool) {
            returnValue = false;
        }
        return returnValue;
    };
    Pointable.invalid = function invalid() {
        return new Pointable();
    };
    Pointable.prototype.toString = function () {
        return "[Pointable direction: " + this.direction + " tipPosition: " + this.tipPosition + " tipVelocity: " + this.tipVelocity + "]";
    };
    return Pointable;
})();
exports.Pointable = Pointable;
