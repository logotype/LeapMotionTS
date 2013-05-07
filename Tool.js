var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var pointableModule = require('./Pointable')
var Tool = (function (_super) {
    __extends(Tool, _super);
    function Tool() {
        _super.call(this);
        this.isFinger = false;
        this.isTool = true;
    }
    Tool.invalid = function invalid() {
        return new Tool();
    };
    return Tool;
})(pointableModule.Pointable);
exports.Tool = Tool;
