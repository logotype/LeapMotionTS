var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="./../Controller.ts"/>
/// <reference path="./../Frame.ts"/>
/// <reference path="./../util/LeapEvent.ts"/>
/// <reference path="./../Listener.ts"/>
var DefaultListener = (function (_super) {
    __extends(DefaultListener, _super);
    function DefaultListener() {
        _super.call(this);
    }
    DefaultListener.prototype.onConnect = function (controller) {
        controller.dispatchEvent(new LeapEvent(LeapEvent.LEAPMOTION_CONNECTED, this));
    };

    DefaultListener.prototype.onDisconnect = function (controller) {
        controller.dispatchEvent(new LeapEvent(LeapEvent.LEAPMOTION_DISCONNECTED, this));
    };

    DefaultListener.prototype.onExit = function (controller) {
        controller.dispatchEvent(new LeapEvent(LeapEvent.LEAPMOTION_EXIT, this));
    };

    DefaultListener.prototype.onFrame = function (controller, frame) {
        controller.dispatchEvent(new LeapEvent(LeapEvent.LEAPMOTION_FRAME, this, frame));
    };

    DefaultListener.prototype.onInit = function (controller) {
        controller.dispatchEvent(new LeapEvent(LeapEvent.LEAPMOTION_INIT, this));
    };
    return DefaultListener;
})(EventDispatcher);
//# sourceMappingURL=DefaultListener.js.map
