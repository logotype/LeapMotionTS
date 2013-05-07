var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var pointableModule = require('./Pointable')
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
})(pointableModule.Pointable);
exports.Finger = Finger;
