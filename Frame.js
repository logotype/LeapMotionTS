var Leap;
(function (Leap) {
    var Frame = (function () {
        function Frame() {
            this.fingers = [];
            this.hands = [];
            this.pointables = [];
            this._gestures = [];
            this.tools = [];
        }
        Frame.prototype.hand = function (id) {
            var returnValue = Leap.Hand.invalid();
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
        Frame.prototype.tool = function (id) {
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
        Frame.prototype.pointable = function (id) {
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
        Frame.prototype.gesture = function (id) {
            var returnValue = Leap.Gesture.invalid();
            var i = 0;
            var length = this._gestures.length;
            for(i; i < length; ++i) {
                if(this._gestures[i].id == id) {
                    returnValue = this._gestures[i];
                    break;
                }
            }
            return returnValue;
        };
        Frame.prototype.gestures = function (sinceFrame) {
            if (typeof sinceFrame === "undefined") { sinceFrame = null; }
            if(!sinceFrame) {
                return this._gestures;
            } else {
                var gesturesSinceFrame = [];
                var i = 0;
                var j = 0;
                for(i; i < this.controller.frameHistory.length; ++i) {
                    for(j; j < this.controller.frameHistory[i]._gestures.length; ++j) {
                        gesturesSinceFrame.push(this.controller.frameHistory[i]._gestures[j]);
                    }
                    if(sinceFrame == this.controller.frameHistory[i]) {
                        break;
                    }
                }
                return gesturesSinceFrame;
            }
        };
        Frame.prototype.rotationAxis = function (sinceFrame) {
            var returnValue;
            if(sinceFrame && sinceFrame.rotation) {
                var vector = new Leap.Vector3(this.rotation.zBasis.y - sinceFrame.rotation.yBasis.z, this.rotation.xBasis.z - sinceFrame.rotation.zBasis.x, this.rotation.yBasis.x - sinceFrame.rotation.xBasis.y);
                returnValue = vector.normalized();
            } else {
                returnValue = new Leap.Vector3(0, 0, 0);
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
                returnValue = Leap.Matrix.identity();
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
                returnValue = new Leap.Vector3(this.translationVector.x - sinceFrame.translationVector.x, this.translationVector.y - sinceFrame.translationVector.y, this.translationVector.z - sinceFrame.translationVector.z);
            } else {
                returnValue = new Leap.Vector3(0, 0, 0);
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
    Leap.Frame = Frame;    
})(Leap || (Leap = {}));
//@ sourceMappingURL=Frame.js.map
