/// <reference path="./../Frame.ts"/>
/// <reference path="./../Listener.ts"/>
var LeapEvent = (function () {
    function LeapEvent(type, targetListener, frame) {
        if (typeof frame === "undefined") { frame = null; }
        this._type = type;
        this._target = targetListener;
        this.frame = frame;
    }
    LeapEvent.prototype.getTarget = function () {
        return this._target;
    };

    LeapEvent.prototype.getType = function () {
        return this._type;
    };
    LeapEvent.LEAPMOTION_INIT = "leapMotionInit";
    LeapEvent.LEAPMOTION_CONNECTED = "leapMotionConnected";
    LeapEvent.LEAPMOTION_DISCONNECTED = "leapMotionDisconnected";
    LeapEvent.LEAPMOTION_EXIT = "leapMotionExit";
    LeapEvent.LEAPMOTION_FRAME = "leapMotionFrame";
    return LeapEvent;
})();
//# sourceMappingURL=LeapEvent.js.map
