var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Leap;
(function (Leap) {
    var Finger = (function (_super) {
        __extends(Finger, _super);
        function Finger() {
                _super.call(this);
            this.isFinger = true;
            this.isTool = false;
        }
        Finger.invalid = function invalid() {
            return new Finger();
        };
        return Finger;
    })(Leap.Pointable);
    Leap.Finger = Finger;    
})(Leap || (Leap = {}));
//@ sourceMappingURL=Finger.js.map
