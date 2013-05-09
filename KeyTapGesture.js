var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Leap;
(function (Leap) {
    var KeyTapGesture = (function (_super) {
        __extends(KeyTapGesture, _super);
        function KeyTapGesture() {
                _super.call(this);
            this.progress = 1;
        }
        KeyTapGesture.classType = Leap.Gesture.TYPE_KEY_TAP;
        return KeyTapGesture;
    })(Leap.Gesture);
    Leap.KeyTapGesture = KeyTapGesture;    
})(Leap || (Leap = {}));
//@ sourceMappingURL=KeyTapGesture.js.map
