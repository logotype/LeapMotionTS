var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Leap;
(function (Leap) {
    var CircleGesture = (function (_super) {
        __extends(CircleGesture, _super);
        function CircleGesture() {
                _super.call(this);
            this.pointable = Leap.Pointable.invalid();
        }
        CircleGesture.classType = Leap.Gesture.TYPE_CIRCLE;
        return CircleGesture;
    })(Leap.Gesture);
    Leap.CircleGesture = CircleGesture;    
})(Leap || (Leap = {}));
//@ sourceMappingURL=CircleGesture.js.map
