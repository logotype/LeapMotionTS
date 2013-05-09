var Leap;
(function (Leap) {
    var Hand = (function () {
        function Hand() {
            this.fingers = [];
            this.pointables = [];
            this.tools = [];
        }
        Hand.prototype.isValid = function () {
            var returnValue = false;
            if((this.direction && this.direction.isValid()) && (this.palmNormal && this.palmNormal.isValid()) && (this.palmPosition && this.palmPosition.isValid()) && (this.palmVelocity && this.palmVelocity.isValid()) && (this.sphereCenter && this.sphereCenter.isValid())) {
                returnValue = true;
            }
            return returnValue;
        };
        Hand.prototype.isEqualTo = function (other) {
            var returnValue = false;
            if(this.id == other.id && this.frame == other.frame && this.isValid() && other.isValid()) {
                returnValue = true;
            }
            return returnValue;
        };
        Hand.prototype.finger = function (id) {
            var returnValue = Leap.Finger.invalid();
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
        Hand.prototype.tool = function (id) {
            var returnValue = Leap.Tool.invalid();
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
        Hand.prototype.pointable = function (id) {
            var returnValue = Leap.Pointable.invalid();
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
        Hand.prototype.rotationAxis = function (sinceFrame) {
            var returnValue;
            if(sinceFrame.hand(this.id)) {
                var vector = new Leap.Vector3(this.rotation.zBasis.y - sinceFrame.hand(this.id).rotation.yBasis.z, this.rotation.xBasis.z - sinceFrame.hand(this.id).rotation.zBasis.x, this.rotation.yBasis.x - sinceFrame.hand(this.id).rotation.xBasis.y);
                returnValue = vector.normalized();
            } else {
                returnValue = new Leap.Vector3(0, 0, 0);
            }
            return returnValue;
        };
        Hand.prototype.rotationAngle = function (sinceFrame, axis) {
            if (typeof axis === "undefined") { axis = null; }
            var returnValue = 0;
            if(!axis) {
                if(sinceFrame.hand(this.id) && sinceFrame.hand(this.id).frame) {
                    var rotationSinceFrameMatrix = this.rotationMatrix(sinceFrame.hand(this.id).frame);
                    var cs = (rotationSinceFrameMatrix.xBasis.x + rotationSinceFrameMatrix.yBasis.y + rotationSinceFrameMatrix.zBasis.z) * 0.5;
                    var angle = Math.acos(cs);
                    returnValue = isNaN(angle) ? 0 : angle;
                }
            } else {
                if(sinceFrame.hand(this.id) && sinceFrame.hand(this.id).frame) {
                    var rotAxis = this.rotationAxis(sinceFrame.hand(this.id).frame);
                    var rotAngle = this.rotationAngle(sinceFrame.hand(this.id).frame);
                    returnValue = rotAngle * rotAxis.dot(axis.normalized());
                }
            }
            return returnValue;
        };
        Hand.prototype.rotationMatrix = function (sinceFrame) {
            var returnValue;
            if(sinceFrame.hand(this.id) && sinceFrame.hand(this.id).rotation) {
                returnValue = this.rotation.multiply(sinceFrame.hand(this.id).rotation);
            } else {
                returnValue = Leap.Matrix.identity();
            }
            return returnValue;
        };
        Hand.prototype.scaleFactor = function (sinceFrame) {
            var returnValue;
            if(sinceFrame && sinceFrame.hand(this.id) && sinceFrame.hand(this.id).scaleFactorNumber) {
                returnValue = Math.exp(this.scaleFactorNumber - sinceFrame.hand(this.id).scaleFactorNumber);
            } else {
                returnValue = 1;
            }
            return returnValue;
        };
        Hand.prototype.translation = function (sinceFrame) {
            var returnValue;
            if(sinceFrame.hand(this.id) && sinceFrame.hand(this.id).translationVector) {
                returnValue = new Leap.Vector3(this.translationVector.x - sinceFrame.hand(this.id).translationVector.x, this.translationVector.y - sinceFrame.hand(this.id).translationVector.y, this.translationVector.z - sinceFrame.hand(this.id).translationVector.z);
            } else {
                returnValue = new Leap.Vector3(0, 0, 0);
            }
            return returnValue;
        };
        Hand.invalid = function invalid() {
            return new Hand();
        };
        return Hand;
    })();
    Leap.Hand = Hand;    
})(Leap || (Leap = {}));
//@ sourceMappingURL=Hand.js.map
