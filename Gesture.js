var Leap;
(function (Leap) {
    var Gesture = (function () {
        function Gesture() {
            this.hands = [];
            this.pointables = [];
        }
        Gesture.STATE_INVALID = 0;
        Gesture.STATE_START = 1;
        Gesture.STATE_UPDATE = 2;
        Gesture.STATE_STOP = 3;
        Gesture.TYPE_INVALID = 4;
        Gesture.TYPE_SWIPE = 5;
        Gesture.TYPE_CIRCLE = 6;
        Gesture.TYPE_SCREEN_TAP = 7;
        Gesture.TYPE_KEY_TAP = 8;
        Gesture.prototype.isEqualTo = function (other) {
            return (this.id == other.id) ? true : false;
        };
        Gesture.prototype.isValid = function () {
            var returnValue = true;
            if(!this.durationSeconds) {
                returnValue = false;
            }
            return returnValue;
        };
        Gesture.invalid = function invalid() {
            return new Gesture();
        };
        Gesture.prototype.toString = function () {
            return "[Gesture id:" + this.id + " duration:" + this.duration + " type:" + this.type + "]";
        };
        return Gesture;
    })();
    Leap.Gesture = Gesture;    
})(Leap || (Leap = {}));
//@ sourceMappingURL=Gesture.js.map
