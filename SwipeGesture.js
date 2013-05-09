var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Leap;
(function (Leap) {
    var SwipeGesture = (function (_super) {
        __extends(SwipeGesture, _super);
        function SwipeGesture() {
                _super.call(this);
        }
        SwipeGesture.classType = Leap.Gesture.TYPE_SWIPE;
        return SwipeGesture;
    })(Leap.Gesture);
    Leap.SwipeGesture = SwipeGesture;    
})(Leap || (Leap = {}));
//@ sourceMappingURL=SwipeGesture.js.map
