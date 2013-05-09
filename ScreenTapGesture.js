var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Leap;
(function (Leap) {
    var ScreenTapGesture = (function (_super) {
        __extends(ScreenTapGesture, _super);
        function ScreenTapGesture() {
                _super.call(this);
            this.progress = 1;
        }
        ScreenTapGesture.classType = Leap.Gesture.TYPE_SCREEN_TAP;
        return ScreenTapGesture;
    })(Leap.Gesture);
    Leap.ScreenTapGesture = ScreenTapGesture;    
})(Leap || (Leap = {}));
//@ sourceMappingURL=ScreenTapGesture.js.map
