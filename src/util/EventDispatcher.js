/// <reference path="./LeapEvent.ts"/>
/**
* The EventDispatcher class provides strongly typed events.
*/
var EventDispatcher = (function () {
    function EventDispatcher() {
        this.listeners = [];
    }
    EventDispatcher.prototype.hasEventListener = function (type, listener) {
        var exists = false;
        for (var i = 0; i < this.listeners.length; i++) {
            if (this.listeners[i].type === type && this.listeners[i].listener === listener) {
                exists = true;
                break;
            }
        }

        return exists;
    };

    EventDispatcher.prototype.addEventListener = function (typeStr, listenerFunction) {
        if (this.hasEventListener(typeStr, listenerFunction))
            return;

        this.listeners.push({ type: typeStr, listener: listenerFunction });
    };

    EventDispatcher.prototype.removeEventListener = function (typeStr, listenerFunction) {
        for (var i = 0; i < this.listeners.length; i++) {
            if (this.listeners[i].type === typeStr && this.listeners[i].listener === listenerFunction)
                this.listeners.splice(i, 1);
        }
    };

    EventDispatcher.prototype.dispatchEvent = function (event) {
        for (var i = 0; i < this.listeners.length; i++) {
            if (this.listeners[i].type === event.getType())
                this.listeners[i].listener.call(this, event);
        }
    };
    return EventDispatcher;
})();
//# sourceMappingURL=EventDispatcher.js.map
