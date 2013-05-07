var vectorModule = require('./Vector3')
var handModule = require('./Hand')
var pointableModule = require('./Pointable')
var fingerModule = require('./Finger')
var toolModule = require('./Tool')
var matrixModule = require('./Matrix')
var Frame = (function () {
    function Frame() {
        this.fingers = [];
        this.hands = [];
        this.pointables = [];
        this.tools = [];
    }
    Frame.prototype.hand = function (id) {
        var returnValue = handModule.Hand.invalid();
        var i = 0;
        var length = this.hands.length;
        for(i; i < length; ++i) {
            if(this.hands[i].id == id) {
                returnValue = this.hands[i];
                break;
            }
        }
        return returnValue;
    };
    Frame.prototype.finger = function (id) {
        var returnValue = fingerModule.Finger.invalid();
        var i = 0;
        var length = this.fingers.length;
        for(i; i < length; ++i) {
            if(this.fingers[i].id == id) {
                returnValue = this.fingers[i];
                break;
            }
        }
        return returnValue;
    };
    Frame.prototype.tool = function (id) {
        var returnValue = toolModule.Tool.invalid();
        var i = 0;
        var length = this.fingers.length;
        for(i; i < length; ++i) {
            if(this.tools[i].id == id) {
                returnValue = this.tools[i];
                break;
            }
        }
        return returnValue;
    };
    Frame.prototype.pointable = function (id) {
        var returnValue = pointableModule.Pointable.invalid();
        var i = 0;
        var length = this.pointables.length;
        for(i; i < length; ++i) {
            if(this.pointables[i].id == id) {
                returnValue = this.pointables[i];
                break;
            }
        }
        return returnValue;
    };
    Frame.prototype.rotationAxis = function (sinceFrame) {
        var returnValue;
        if(sinceFrame && sinceFrame.rotation) {
            var vector = new vectorModule.Vector3(this.rotation.zBasis.y - sinceFrame.rotation.yBasis.z, this.rotation.xBasis.z - sinceFrame.rotation.zBasis.x, this.rotation.yBasis.x - sinceFrame.rotation.xBasis.y);
            returnValue = vector.normalized();
        } else {
            returnValue = new vectorModule.Vector3(0, 0, 0);
        }
        return returnValue;
    };
    Frame.prototype.rotationAngle = function (sinceFrame, axis) {
        if (typeof axis === "undefined") { axis = null; }
        var returnValue = 0;
        if(!axis) {
            var rotationSinceFrameMatrix = this.rotationMatrix(sinceFrame);
            var cs = (rotationSinceFrameMatrix.xBasis.x + rotationSinceFrameMatrix.yBasis.y + rotationSinceFrameMatrix.zBasis.z - 1.0) * 0.5;
            var angle = Math.acos(cs);
            returnValue = isNaN(angle) ? 0 : angle;
        } else {
            var rotAxis = this.rotationAxis(sinceFrame);
            var rotAngle = this.rotationAngle(sinceFrame);
            returnValue = rotAngle * rotAxis.dot(axis.normalized());
        }
        return returnValue;
    };
    Frame.prototype.rotationMatrix = function (sinceFrame) {
        var returnValue;
        if(sinceFrame && sinceFrame.rotation) {
            returnValue = this.rotation.multiply(sinceFrame.rotation);
        } else {
            returnValue = matrixModule.Matrix.identity();
        }
        return returnValue;
    };
    Frame.prototype.scaleFactor = function (sinceFrame) {
        var returnValue;
        if(sinceFrame && sinceFrame.scaleFactorNumber) {
            returnValue = Math.exp(this.scaleFactorNumber - sinceFrame.scaleFactorNumber);
        } else {
            returnValue = 1;
        }
        return returnValue;
    };
    Frame.prototype.translation = function (sinceFrame) {
        var returnValue;
        if(sinceFrame.translationVector) {
            returnValue = new vectorModule.Vector3(this.translationVector.x - sinceFrame.translationVector.x, this.translationVector.y - sinceFrame.translationVector.y, this.translationVector.z - sinceFrame.translationVector.z);
        } else {
            returnValue = new vectorModule.Vector3(0, 0, 0);
        }
        return returnValue;
    };
    Frame.prototype.isEqualTo = function (other) {
        var returnValue = true;
        if(this.id != other.id || !this.isValid() || other.isValid()) {
            returnValue = false;
        }
        return returnValue;
    };
    Frame.prototype.isValid = function () {
        var returnValue = true;
        if(!this.id) {
            returnValue = false;
        }
        return returnValue;
    };
    Frame.invalid = function invalid() {
        return new Frame();
    };
    return Frame;
})();
exports.Frame = Frame;
