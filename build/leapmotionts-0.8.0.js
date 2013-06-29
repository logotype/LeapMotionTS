var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function(require, exports) {
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
    exports.EventDispatcher = EventDispatcher;

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
    exports.DefaultListener = DefaultListener;

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
    exports.LeapEvent = LeapEvent;

    var LeapUtil = (function () {
        function LeapUtil() {
        }
        LeapUtil.toDegrees = function (radians) {
            return radians * 180 / Math.PI;
        };

        LeapUtil.isNearZero = function (value) {
            return Math.abs(value) <= LeapUtil.EPSILON;
        };

        LeapUtil.vectorIsNearZero = function (inVector) {
            return this.isNearZero(inVector.x) && this.isNearZero(inVector.y) && this.isNearZero(inVector.z);
        };

        LeapUtil.extractRotation = function (mtxTransform) {
            return new Matrix(mtxTransform.xBasis, mtxTransform.yBasis, mtxTransform.zBasis);
        };

        LeapUtil.rotationInverse = function (mtxRot) {
            return new Matrix(new Vector3(mtxRot.xBasis.x, mtxRot.yBasis.x, mtxRot.zBasis.x), new Vector3(mtxRot.xBasis.y, mtxRot.yBasis.y, mtxRot.zBasis.y), new Vector3(mtxRot.xBasis.z, mtxRot.yBasis.z, mtxRot.zBasis.z));
        };

        LeapUtil.rigidInverse = function (mtxTransform) {
            var rigidInverse = this.rotationInverse(mtxTransform);
            rigidInverse.origin = rigidInverse.transformDirection(mtxTransform.origin.opposite());
            return rigidInverse;
        };

        LeapUtil.componentWiseMin = function (vLHS, vRHS) {
            return new Vector3(Math.min(vLHS.x, vRHS.x), Math.min(vLHS.y, vRHS.y), Math.min(vLHS.z, vRHS.z));
        };

        LeapUtil.componentWiseMax = function (vLHS, vRHS) {
            return new Vector3(Math.max(vLHS.x, vRHS.x), Math.max(vLHS.y, vRHS.y), Math.max(vLHS.z, vRHS.z));
        };

        LeapUtil.componentWiseScale = function (vLHS, vRHS) {
            return new Vector3(vLHS.x * vRHS.x, vLHS.y * vRHS.y, vLHS.z * vRHS.z);
        };

        LeapUtil.componentWiseReciprocal = function (inVector) {
            return new Vector3(1.0 / inVector.x, 1.0 / inVector.y, 1.0 / inVector.z);
        };

        LeapUtil.minComponent = function (inVector) {
            return Math.min(inVector.x, Math.min(inVector.y, inVector.z));
        };

        LeapUtil.maxComponent = function (inVector) {
            return Math.max(inVector.x, Math.max(inVector.y, inVector.z));
        };

        LeapUtil.heading = function (inVector) {
            return Math.atan2(inVector.z, inVector.x);
        };

        LeapUtil.elevation = function (inVector) {
            return Math.atan2(inVector.y, Math.sqrt(inVector.z * inVector.z + inVector.x * inVector.x));
        };

        LeapUtil.normalizeSpherical = function (vSpherical) {
            var fHeading = vSpherical.y;
            var fElevation = vSpherical.z;

            while (fElevation <= -Math.PI)
                fElevation += LeapUtil.TWO_PI;
            while (fElevation > Math.PI)
                fElevation -= LeapUtil.TWO_PI;

            if (Math.abs(fElevation) > LeapUtil.HALF_PI) {
                fHeading += Math.PI;
                fElevation = fElevation > 0 ? (Math.PI - fElevation) : -(Math.PI + fElevation);
            }

            while (fHeading <= -Math.PI)
                fHeading += LeapUtil.TWO_PI;
            while (fHeading > Math.PI)
                fHeading -= LeapUtil.TWO_PI;

            return new Vector3(1, fHeading, fElevation);
        };

        LeapUtil.cartesianToSpherical = function (vCartesian) {
            return new Vector3(vCartesian.magnitude(), this.heading(vCartesian), this.elevation(vCartesian));
        };

        LeapUtil.sphericalToCartesian = function (vSpherical) {
            var fMagnitude = vSpherical.x;
            var fCosHeading = Math.cos(vSpherical.y);
            var fSinHeading = Math.sin(vSpherical.y);
            var fCosElevation = Math.cos(vSpherical.z);
            var fSinElevation = Math.sin(vSpherical.z);

            return new Vector3(fCosHeading * fCosElevation * fMagnitude, fSinElevation * fMagnitude, fSinHeading * fCosElevation * fMagnitude);
        };

        LeapUtil.clamp = function (inVal, minVal, maxVal) {
            return (inVal < minVal) ? minVal : ((inVal > maxVal) ? maxVal : inVal);
        };

        LeapUtil.lerp = function (a, b, coefficient) {
            return a + ((b - a) * coefficient);
        };

        LeapUtil.lerpVector = function (vec1, vec2, coefficient) {
            return vec1.plus(vec2.minus(vec1).multiply(coefficient));
        };
        LeapUtil.PI = 3.1415926536;

        LeapUtil.DEG_TO_RAD = 0.0174532925;

        LeapUtil.RAD_TO_DEG = 57.295779513;

        LeapUtil.TWO_PI = Math.PI + Math.PI;

        LeapUtil.HALF_PI = Math.PI * 0.5;

        LeapUtil.EPSILON = 0.00001;
        return LeapUtil;
    })();
    exports.LeapUtil = LeapUtil;

    var Controller = (function (_super) {
        __extends(Controller, _super);
        function Controller(host) {
            if (typeof host === "undefined") { host = null; }
            var _this = this;
            _super.call(this);
            this.frameHistory = [];
            this._isConnected = false;
            this._isGesturesEnabled = false;

            this.listener = new DefaultListener();

            if (!host) {
                this.connection = new WebSocket("ws://localhost:6437");
            } else {
                this.connection = new WebSocket("ws://" + host + ":6437");
            }

            this.listener.onInit(this);

            this.connection.onopen = function (event) {
                _this._isConnected = true;
                _this.listener.onConnect(_this);
            };

            this.connection.onclose = function (data) {
                _this._isConnected = false;
                _this.listener.onDisconnect(_this);
            };

            this.connection.onmessage = function (data) {
                var i;
                var json;
                var currentFrame;
                var hand;
                var pointable;
                var gesture;
                var isTool;
                var length;
                var type;

                json = JSON.parse(data["data"]);

                if ((typeof json["timestamp"] === "undefined")) {
                    return;
                }

                currentFrame = new Frame();
                currentFrame.controller = _this;

                if (!(typeof json["hands"] === "undefined")) {
                    i = 0;
                    length = json["hands"].length;
                    for (i = 0; i < length; i++) {
                        hand = new Hand();
                        hand.frame = currentFrame;
                        hand.direction = new Vector3(json["hands"][i].direction[0], json["hands"][i].direction[1], json["hands"][i].direction[2]);
                        hand.id = json["hands"][i].id;
                        hand.palmNormal = new Vector3(json["hands"][i].palmNormal[0], json["hands"][i].palmNormal[1], json["hands"][i].palmNormal[2]);
                        hand.palmPosition = new Vector3(json["hands"][i].palmPosition[0], json["hands"][i].palmPosition[1], json["hands"][i].palmPosition[2]);
                        hand.palmVelocity = new Vector3(json["hands"][i].palmPosition[0], json["hands"][i].palmPosition[1], json["hands"][i].palmPosition[2]);
                        hand.rotation = new Matrix(new Vector3(json["hands"][i]["r"][0][0], json["hands"][i]["r"][0][1], json["hands"][i]["r"][0][2]), new Vector3(json["hands"][i]["r"][1][0], json["hands"][i]["r"][1][1], json["hands"][i]["r"][1][2]), new Vector3(json["hands"][i]["r"][2][0], json["hands"][i]["r"][2][1], json["hands"][i]["r"][2][2]));
                        hand.scaleFactorNumber = json["hands"][i]["s"];
                        hand.sphereCenter = new Vector3(json["hands"][i].sphereCenter[0], json["hands"][i].sphereCenter[1], json["hands"][i].sphereCenter[2]);
                        hand.sphereRadius = json["hands"][i].sphereRadius;
                        hand.translationVector = new Vector3(json["hands"][i]["t"][0], json["hands"][i]["t"][1], json["hands"][i]["t"][2]);
                        currentFrame.hands.push(hand);
                    }
                }

                currentFrame.id = json["id"];

                if (!(typeof json["interactionBox"] === "undefined")) {
                    currentFrame.interactionBox = new InteractionBox();
                    currentFrame.interactionBox.center = new Vector3(json["interactionBox"].center[0], json["interactionBox"].center[1], json["interactionBox"].center[2]);
                    currentFrame.interactionBox.width = json["interactionBox"].size[0];
                    currentFrame.interactionBox.height = json["interactionBox"].size[1];
                    currentFrame.interactionBox.depth = json["interactionBox"].size[2];
                }

                if (!(typeof json["pointables"] === "undefined")) {
                    i = 0;
                    length = json["pointables"].length;
                    for (i = 0; i < length; i++) {
                        isTool = json["pointables"][i].tool;
                        if (isTool)
                            pointable = new Tool(); else
                            pointable = new Finger();

                        pointable.frame = currentFrame;
                        pointable.id = json["pointables"][i].id;
                        pointable.hand = Controller.getHandByID(currentFrame, json["pointables"][i]["handId"]);
                        pointable.length = json["pointables"][i].length;
                        pointable.direction = new Vector3(json["pointables"][i].direction[0], json["pointables"][i].direction[1], json["pointables"][i].direction[2]);
                        pointable.tipPosition = new Vector3(json["pointables"][i].tipPosition[0], json["pointables"][i].tipPosition[1], json["pointables"][i].tipPosition[2]);
                        pointable.stabilizedTipPosition = new Vector3(json["pointables"][i].stabilizedTipPosition[0], json["pointables"][i].stabilizedTipPosition[1], json["pointables"][i].stabilizedTipPosition[2]);
                        pointable.tipVelocity = new Vector3(json["pointables"][i].tipVelocity[0], json["pointables"][i].tipVelocity[1], json["pointables"][i].tipVelocity[2]);
                        pointable.touchDistance = json["pointables"][i].touchDist;
                        currentFrame.pointables.push(pointable);

                        switch (json["pointables"][i].touchZone) {
                            case "hovering":
                                pointable.touchZone = Zone.ZONE_HOVERING;
                                break;
                            case "touching":
                                pointable.touchZone = Zone.ZONE_TOUCHING;
                                break;
                            default:
                                pointable.touchZone = Zone.ZONE_NONE;
                                break;
                        }

                        if (pointable.hand)
                            pointable.hand.pointables.push(pointable);

                        if (isTool) {
                            pointable.isTool = true;
                            pointable.isFinger = false;
                            pointable.width = json["pointables"][i].width;
                            currentFrame.tools.push(pointable);
                            if (pointable.hand)
                                pointable.hand.tools.push(pointable);
                        } else {
                            pointable.isTool = false;
                            pointable.isFinger = true;
                            currentFrame.fingers.push(pointable);
                            if (pointable.hand)
                                pointable.hand.fingers.push(pointable);
                        }
                    }
                }

                if (!(typeof json["gestures"] === "undefined")) {
                    i = 0;
                    length = json["gestures"].length;
                    for (i = 0; i < length; i++) {
                        switch (json["gestures"][i].type) {
                            case "circle":
                                gesture = new CircleGesture();
                                type = Type.TYPE_CIRCLE;
                                var circle = gesture;

                                circle.center = new Vector3(json["gestures"][i].center[0], json["gestures"][i].center[1], json["gestures"][i].center[2]);
                                circle.normal = new Vector3(json["gestures"][i].normal[0], json["gestures"][i].normal[1], json["gestures"][i].normal[2]);
                                circle.progress = json["gestures"][i].progress;
                                circle.radius = json["gestures"][i].radius;
                                break;

                            case "swipe":
                                gesture = new SwipeGesture();
                                type = Type.TYPE_SWIPE;

                                var swipe = gesture;

                                swipe.startPosition = new Vector3(json["gestures"][i].startPosition[0], json["gestures"][i].startPosition[1], json["gestures"][i].startPosition[2]);
                                swipe.position = new Vector3(json["gestures"][i].position[0], json["gestures"][i].position[1], json["gestures"][i].position[2]);
                                swipe.direction = new Vector3(json["gestures"][i].direction[0], json["gestures"][i].direction[1], json["gestures"][i].direction[2]);
                                swipe.speed = json["gestures"][i].speed;
                                break;

                            case "screenTap":
                                gesture = new ScreenTapGesture();
                                type = Type.TYPE_SCREEN_TAP;

                                var screenTap = gesture;
                                screenTap.position = new Vector3(json["gestures"][i].position[0], json["gestures"][i].position[1], json["gestures"][i].position[2]);
                                screenTap.direction = new Vector3(json["gestures"][i].direction[0], json["gestures"][i].direction[1], json["gestures"][i].direction[2]);
                                screenTap.progress = json["gestures"][i].progress;
                                break;

                            case "keyTap":
                                gesture = new KeyTapGesture();
                                type = Type.TYPE_KEY_TAP;

                                var keyTap = gesture;
                                keyTap.position = new Vector3(json["gestures"][i].position[0], json["gestures"][i].position[1], json["gestures"][i].position[2]);
                                keyTap.direction = new Vector3(json["gestures"][i].direction[0], json["gestures"][i].direction[1], json["gestures"][i].direction[2]);
                                keyTap.progress = json["gestures"][i].progress;
                                break;

                            default:
                                throw new Error("unkown gesture type");
                        }

                        var j = 0;
                        var lengthInner = 0;

                        if (!(typeof json["gestures"][i]["handIds"] === "undefined")) {
                            j = 0;
                            lengthInner = json["gestures"][i]["handIds"].length;
                            for (j = 0; j < lengthInner; ++j) {
                                var gestureHand = Controller.getHandByID(currentFrame, json["gestures"][i]["handIds"][j]);
                                gesture.hands.push(gestureHand);
                            }
                        }

                        if (!(typeof json["gestures"][i]["pointableIds"] === "undefined")) {
                            j = 0;
                            lengthInner = json["gestures"][i]["pointableIds"].length;
                            for (j = 0; j < lengthInner; ++j) {
                                var gesturePointable = Controller.getPointableByID(currentFrame, json["gestures"][i]["pointableIds"][j]);
                                if (gesturePointable) {
                                    gesture.pointables.push(gesturePointable);
                                }
                            }
                            if (gesture instanceof CircleGesture && gesture.pointables.length > 0) {
                                (gesture).pointable = gesture.pointables[0];
                            }
                        }

                        gesture.frame = currentFrame;
                        gesture.id = json["gestures"][i].id;
                        gesture.duration = json["gestures"][i].duration;
                        gesture.durationSeconds = gesture.duration / 1000000;

                        switch (json["gestures"][i].state) {
                            case "start":
                                gesture.state = State.STATE_START;
                                break;
                            case "update":
                                gesture.state = State.STATE_UPDATE;
                                break;
                            case "stop":
                                gesture.state = State.STATE_STOP;
                                break;
                            default:
                                gesture.state = State.STATE_INVALID;
                        }

                        gesture.type = type;

                        currentFrame._gestures.push(gesture);
                    }
                }

                if (json["r"])
                    currentFrame.rotation = new Matrix(new Vector3(json["r"][0][0], json["r"][0][1], json["r"][0][2]), new Vector3(json["r"][1][0], json["r"][1][1], json["r"][1][2]), new Vector3(json["r"][2][0], json["r"][2][1], json["r"][2][2]));

                currentFrame.scaleFactorNumber = json["s"];

                if (json["t"])
                    currentFrame.translationVector = new Vector3(json["t"][0], json["t"][1], json["t"][2]);

                currentFrame.timestamp = json["timestamp"];

                if (_this.frameHistory.length > 59)
                    _this.frameHistory.splice(59, 1);

                _this.frameHistory.unshift(_this.latestFrame);
                _this.latestFrame = currentFrame;
                _this.listener.onFrame(_this, _this.latestFrame);
            };
        }
        Controller.getHandByID = function (frame, id) {
            var returnValue = null;
            var i = 0;

            for (i = 0; i < frame.hands.length; i++) {
                if ((frame.hands[i]).id === id) {
                    returnValue = (frame.hands[i]);
                    break;
                }
            }
            return returnValue;
        };

        Controller.getPointableByID = function (frame, id) {
            var returnValue = null;
            var i = 0;

            for (i = 0; i < frame.pointables.length; i++) {
                if ((frame.pointables[i]).id === id) {
                    returnValue = (frame.pointables[i]);
                    break;
                }
            }
            return returnValue;
        };

        Controller.prototype.frame = function (history) {
            if (typeof history === "undefined") { history = 0; }
            if (history >= this.frameHistory.length)
                return Frame.invalid(); else
                return this.frameHistory[history];
        };

        Controller.prototype.setListener = function (listener) {
            this.listener = listener;
        };

        Controller.prototype.enableGesture = function (type, enable) {
            if (typeof enable === "undefined") { enable = true; }
            var enableObject = {};

            if (enable) {
                this._isGesturesEnabled = true;
                enableObject["enableGestures"] = true;
            } else {
                this._isGesturesEnabled = false;
                enableObject["enableGestures"] = false;
            }

            this.connection.send(JSON.stringify(enableObject));
        };

        Controller.prototype.isGestureEnabled = function (type) {
            return this._isGesturesEnabled;
        };

        Controller.prototype.isConnected = function () {
            return this._isConnected;
        };
        return Controller;
    })(EventDispatcher);
    exports.Controller = Controller;

    var InteractionBox = (function () {
        function InteractionBox() {
        }
        InteractionBox.prototype.denormalizePoint = function (normalizedPosition) {
            var vec = Vector3.invalid();

            vec.x = (((normalizedPosition.x + this.center.x) - 0.5) * this.width);
            vec.y = (((normalizedPosition.y + this.center.y) - 0.5) * this.height);
            vec.z = (((normalizedPosition.z + this.center.z) - 0.5) * this.depth);

            return vec;
        };

        InteractionBox.prototype.normalizePoint = function (position, clamp) {
            if (typeof clamp === "undefined") { clamp = true; }
            var vec = Vector3.invalid();

            vec.x = ((position.x - this.center.x) / this.width) + 0.5;
            vec.y = ((position.y - this.center.y) / this.height) + 0.5;
            vec.z = ((position.z - this.center.z) / this.depth) + 0.5;

            if (clamp) {
                vec.x = Math.min(Math.max(vec.x, 0), 1);
                vec.y = Math.min(Math.max(vec.y, 0), 1);
                vec.z = Math.min(Math.max(vec.z, 0), 1);
            }

            return vec;
        };

        InteractionBox.prototype.isValid = function () {
            return this.center.isValid() && this.width > 0 && this.height > 0 && this.depth > 0;
        };

        InteractionBox.prototype.isEqualTo = function (other) {
            if (!this.isValid() || !other.isValid())
                return false;

            if (!this.center.isEqualTo(other.center))
                return false;

            if (this.depth != other.depth)
                return false;

            if (this.height != other.height)
                return false;

            if (this.width != other.width)
                return false;

            return true;
        };

        InteractionBox.invalid = function () {
            return new InteractionBox();
        };

        InteractionBox.prototype.toString = function () {
            return "[InteractionBox depth:" + this.depth + " height:" + this.height + " width:" + this.width + "]";
        };
        return InteractionBox;
    })();
    exports.InteractionBox = InteractionBox;

    (function (Zone) {
        Zone[Zone["ZONE_NONE"] = 0] = "ZONE_NONE";

        Zone[Zone["ZONE_HOVERING"] = 1] = "ZONE_HOVERING";

        Zone[Zone["ZONE_TOUCHING"] = 2] = "ZONE_TOUCHING";
    })(exports.Zone || (exports.Zone = {}));
    var Zone = exports.Zone;

    var Pointable = (function () {
        function Pointable() {
            this.touchZone = Zone.ZONE_NONE;
            this.touchDistance = 0;
            this.length = 0;
            this.width = 0;
            this.direction = Vector3.invalid();
            this.tipPosition = Vector3.invalid();
            this.tipVelocity = Vector3.invalid();
        }
        Pointable.prototype.isValid = function () {
            var returnValue = false;

            if ((this.direction && this.direction.isValid()) && (this.tipPosition && this.tipPosition.isValid()) && (this.tipVelocity && this.tipVelocity.isValid()))
                returnValue = true;

            return returnValue;
        };

        Pointable.prototype.isEqualTo = function (other) {
            if (!this.isValid() || !other.isValid())
                return false;

            if (this.frame != other.frame)
                return false;

            if (this.hand != other.hand)
                return false;

            if (!this.direction.isEqualTo(other.direction))
                return false;

            if (this.length != other.length)
                return false;

            if (this.width != other.width)
                return false;

            if (this.id != other.id)
                return false;

            if (!this.tipPosition.isEqualTo(other.tipPosition))
                return false;

            if (!this.tipVelocity.isEqualTo(other.tipVelocity))
                return false;

            if (this.isFinger != other.isFinger || this.isTool != other.isTool)
                return false;

            return true;
        };

        Pointable.invalid = function () {
            return new Pointable();
        };

        Pointable.prototype.toString = function () {
            return "[Pointable direction: " + this.direction + " tipPosition: " + this.tipPosition + " tipVelocity: " + this.tipVelocity + "]";
        };
        return Pointable;
    })();
    exports.Pointable = Pointable;

    (function (State) {
        State[State["STATE_INVALID"] = 0] = "STATE_INVALID";

        State[State["STATE_START"] = 1] = "STATE_START";

        State[State["STATE_UPDATE"] = 2] = "STATE_UPDATE";

        State[State["STATE_STOP"] = 3] = "STATE_STOP";
    })(exports.State || (exports.State = {}));
    var State = exports.State;

    (function (Type) {
        Type[Type["TYPE_INVALID"] = 4] = "TYPE_INVALID";

        Type[Type["TYPE_SWIPE"] = 5] = "TYPE_SWIPE";

        Type[Type["TYPE_CIRCLE"] = 6] = "TYPE_CIRCLE";

        Type[Type["TYPE_SCREEN_TAP"] = 7] = "TYPE_SCREEN_TAP";

        Type[Type["TYPE_KEY_TAP"] = 8] = "TYPE_KEY_TAP";
    })(exports.Type || (exports.Type = {}));
    var Type = exports.Type;
    var Gesture = (function () {
        function Gesture() {
            this.hands = [];
            this.pointables = [];
        }
        Gesture.prototype.isEqualTo = function (other) {
            return (this.id == other.id);
        };

        Gesture.prototype.isValid = function () {
            if (!this.durationSeconds)
                return false;

            return true;
        };

        Gesture.invalid = function () {
            return new Gesture();
        };

        Gesture.prototype.toString = function () {
            return "[Gesture id:" + this.id + " duration:" + this.duration + " type:" + this.type + "]";
        };
        return Gesture;
    })();
    exports.Gesture = Gesture;

    var Finger = (function (_super) {
        __extends(Finger, _super);
        function Finger() {
            _super.call(this);
            this.isFinger = true;
            this.isTool = false;
        }
        Finger.invalid = function () {
            return new Finger();
        };
        return Finger;
    })(Pointable);
    exports.Finger = Finger;

    var Tool = (function (_super) {
        __extends(Tool, _super);
        function Tool() {
            _super.call(this);
            this.isFinger = false;
            this.isTool = true;
        }
        Tool.invalid = function () {
            return new Tool();
        };
        return Tool;
    })(Pointable);
    exports.Tool = Tool;

    var Hand = (function () {
        function Hand() {
            this.fingers = [];
            this.pointables = [];
            this.tools = [];
        }
        Hand.prototype.isValid = function () {
            if ((this.direction && this.direction.isValid()) && (this.palmNormal && this.palmNormal.isValid()) && (this.palmPosition && this.palmPosition.isValid()) && (this.palmVelocity && this.palmVelocity.isValid()) && (this.sphereCenter && this.sphereCenter.isValid()))
                return true;

            return false;
        };

        Hand.prototype.isEqualTo = function (other) {
            if (this.id === other.id && this.frame === other.frame && this.isValid() && other.isValid())
                return true;

            return false;
        };

        Hand.prototype.finger = function (id) {
            var returnValue = Finger.invalid();
            var length = this.fingers.length;

            for (var i = 0; i < length; i++) {
                if (this.fingers[i].id === id) {
                    returnValue = this.fingers[i];
                    break;
                }
            }

            return returnValue;
        };

        Hand.prototype.tool = function (id) {
            var returnValue = Tool.invalid();
            var length = this.fingers.length;

            for (var i = 0; i < length; i++) {
                if (this.tools[i].id === id) {
                    returnValue = this.tools[i];
                    break;
                }
            }

            return returnValue;
        };

        Hand.prototype.pointable = function (id) {
            var returnValue = Pointable.invalid();
            var length = this.pointables.length;

            for (var i = 0; i < length; i++) {
                if (this.pointables[i].id === id) {
                    returnValue = this.pointables[i];
                    break;
                }
            }

            return returnValue;
        };

        Hand.prototype.rotationAxis = function (sinceFrame) {
            if (sinceFrame.hand(this.id)) {
                return new Vector3(this.rotation.zBasis.y - sinceFrame.hand(this.id).rotation.yBasis.z, this.rotation.xBasis.z - sinceFrame.hand(this.id).rotation.zBasis.x, this.rotation.yBasis.x - sinceFrame.hand(this.id).rotation.xBasis.y).normalized();
            } else {
                return new Vector3(0, 0, 0);
            }
        };

        Hand.prototype.rotationAngle = function (sinceFrame, axis) {
            if (typeof axis === "undefined") { axis = null; }
            if (!this.isValid() || !sinceFrame.hand(this.id).isValid())
                return 0.0;

            var returnValue = 0.0;
            var rotationSinceFrameMatrix = this.rotationMatrix(sinceFrame);
            var cs = (rotationSinceFrameMatrix.xBasis.x + rotationSinceFrameMatrix.yBasis.y + rotationSinceFrameMatrix.zBasis.z - 1) * 0.5;
            var angle = Math.acos(cs);
            returnValue = isNaN(angle) ? 0.0 : angle;

            if (axis) {
                var rotAxis = this.rotationAxis(sinceFrame.hand(this.id).frame);
                returnValue *= rotAxis.dot(axis.normalized());
            }

            return returnValue;
        };

        Hand.prototype.rotationMatrix = function (sinceFrame) {
            if (sinceFrame.hand(this.id).isValid()) {
                return sinceFrame.hand(this.id).rotation.multiply(new Matrix(new Vector3(this.rotation.xBasis.x, this.rotation.yBasis.x, this.rotation.zBasis.x), new Vector3(this.rotation.xBasis.y, this.rotation.yBasis.y, this.rotation.zBasis.y), new Vector3(this.rotation.xBasis.z, this.rotation.yBasis.z, this.rotation.zBasis.z)));
            } else {
                return Matrix.identity();
            }
        };

        Hand.prototype.scaleFactor = function (sinceFrame) {
            var returnValue;
            if (sinceFrame && sinceFrame.hand(this.id) && sinceFrame.hand(this.id).scaleFactorNumber)
                returnValue = Math.exp(this.scaleFactorNumber - sinceFrame.hand(this.id).scaleFactorNumber); else
                returnValue = 1;

            return returnValue;
        };

        Hand.prototype.translation = function (sinceFrame) {
            var returnValue;

            if (sinceFrame.hand(this.id) && sinceFrame.hand(this.id).translationVector)
                returnValue = new Vector3(this.translationVector.x - sinceFrame.hand(this.id).translationVector.x, this.translationVector.y - sinceFrame.hand(this.id).translationVector.y, this.translationVector.z - sinceFrame.hand(this.id).translationVector.z); else
                returnValue = new Vector3(0, 0, 0);

            return returnValue;
        };

        Hand.invalid = function () {
            return new Hand();
        };
        return Hand;
    })();
    exports.Hand = Hand;

    var Frame = (function () {
        function Frame() {
            this.fingers = [];
            this.hands = [];
            this.pointables = [];
            this._gestures = [];
            this.tools = [];
        }
        Frame.prototype.hand = function (id) {
            var returnValue = Hand.invalid();
            var length = this.hands.length;

            for (var i = 0; i < length; i++) {
                if (this.hands[i].id === id) {
                    returnValue = this.hands[i];
                    break;
                }
            }

            return returnValue;
        };

        Frame.prototype.finger = function (id) {
            var returnValue = Finger.invalid();
            var length = this.fingers.length;

            for (var i = 0; i < length; i++) {
                if (this.fingers[i].id === id) {
                    returnValue = this.fingers[i];
                    break;
                }
            }

            return returnValue;
        };

        Frame.prototype.tool = function (id) {
            var returnValue = Tool.invalid();
            var length = this.fingers.length;

            for (var i = 0; i < length; i++) {
                if (this.tools[i].id === id) {
                    returnValue = this.tools[i];
                    break;
                }
            }

            return returnValue;
        };

        Frame.prototype.pointable = function (id) {
            var returnValue = Pointable.invalid();
            var length = this.pointables.length;

            for (var i = 0; i < length; i++) {
                if (this.pointables[i].id === id) {
                    returnValue = this.pointables[i];
                    break;
                }
            }

            return returnValue;
        };

        Frame.prototype.gesture = function (id) {
            var returnValue = Gesture.invalid();
            var length = this._gestures.length;

            for (var i = 0; i < length; i++) {
                if (this._gestures[i].id === id) {
                    returnValue = this._gestures[i];
                    break;
                }
            }

            return returnValue;
        };

        Frame.prototype.gestures = function (sinceFrame) {
            if (typeof sinceFrame === "undefined") { sinceFrame = null; }
            if (!sinceFrame) {
                return this._gestures;
            } else {
                var gesturesSinceFrame = [];

                for (var i = 0; i < this.controller.frameHistory.length; i++) {
                    for (var j = 0; j < this.controller.frameHistory[i]._gestures.length; ++j)
                        gesturesSinceFrame.push(this.controller.frameHistory[i]._gestures[j]);

                    if (sinceFrame === this.controller.frameHistory[i])
                        break;
                }

                return gesturesSinceFrame;
            }
        };

        Frame.prototype.rotationAxis = function (sinceFrame) {
            if (sinceFrame && sinceFrame.rotation) {
                var vector = new Vector3(this.rotation.zBasis.y - sinceFrame.rotation.yBasis.z, this.rotation.xBasis.z - sinceFrame.rotation.zBasis.x, this.rotation.yBasis.x - sinceFrame.rotation.xBasis.y);
                return vector.normalized();
            } else {
                return new Vector3(0, 0, 0);
            }
        };

        Frame.prototype.rotationAngle = function (sinceFrame, axis) {
            if (typeof axis === "undefined") { axis = null; }
            if (!this.isValid() || !sinceFrame.isValid())
                return 0.0;

            var returnValue = 0.0;
            var rotationSinceFrameMatrix = this.rotationMatrix(sinceFrame);
            var cs = (rotationSinceFrameMatrix.xBasis.x + rotationSinceFrameMatrix.yBasis.y + rotationSinceFrameMatrix.zBasis.z - 1) * 0.5;
            var angle = Math.acos(cs);
            returnValue = isNaN(angle) ? 0.0 : angle;

            if (axis) {
                var rotAxis = this.rotationAxis(sinceFrame);
                returnValue *= rotAxis.dot(axis.normalized());
            }

            return returnValue;
        };

        Frame.prototype.rotationMatrix = function (sinceFrame) {
            if (sinceFrame && sinceFrame.rotation) {
                return sinceFrame.rotation.multiply(new Matrix(new Vector3(this.rotation.xBasis.x, this.rotation.yBasis.x, this.rotation.zBasis.x), new Vector3(this.rotation.xBasis.y, this.rotation.yBasis.y, this.rotation.zBasis.y), new Vector3(this.rotation.xBasis.z, this.rotation.yBasis.z, this.rotation.zBasis.z)));
            } else {
                return Matrix.identity();
            }
        };

        Frame.prototype.scaleFactor = function (sinceFrame) {
            var returnValue;
            if (sinceFrame && sinceFrame.scaleFactorNumber)
                returnValue = Math.exp(this.scaleFactorNumber - sinceFrame.scaleFactorNumber); else
                returnValue = 1;

            return returnValue;
        };

        Frame.prototype.translation = function (sinceFrame) {
            var returnValue;

            if (sinceFrame.translationVector)
                returnValue = new Vector3(this.translationVector.x - sinceFrame.translationVector.x, this.translationVector.y - sinceFrame.translationVector.y, this.translationVector.z - sinceFrame.translationVector.z); else
                returnValue = new Vector3(0, 0, 0);

            return returnValue;
        };

        Frame.prototype.isEqualTo = function (other) {
            var returnValue = true;

            if (this.id != other.id || !this.isValid() || other.isValid())
                returnValue = false;

            return returnValue;
        };

        Frame.prototype.isValid = function () {
            if (!this.id)
                return false;

            return true;
        };

        Frame.invalid = function () {
            return new Frame();
        };
        return Frame;
    })();
    exports.Frame = Frame;

    var Matrix = (function () {
        function Matrix(x, y, z, _origin) {
            if (typeof _origin === "undefined") { _origin = null; }
            this.origin = new Vector3(0, 0, 0);
            this.xBasis = new Vector3(0, 0, 0);
            this.yBasis = new Vector3(0, 0, 0);
            this.zBasis = new Vector3(0, 0, 0);
            this.xBasis = x;
            this.yBasis = y;
            this.zBasis = z;

            if (_origin)
                this.origin = _origin;
        }
        Matrix.prototype.setRotation = function (_axis, angleRadians) {
            var axis = _axis.normalized();
            var s = Math.sin(angleRadians);
            var c = Math.cos(angleRadians);
            var C = (1 - c);

            this.xBasis = new Vector3(axis.x * axis.x * C + c, axis.x * axis.y * C - axis.z * s, axis.x * axis.z * C + axis.y * s);
            this.yBasis = new Vector3(axis.y * axis.x * C + axis.z * s, axis.y * axis.y * C + c, axis.y * axis.z * C - axis.x * s);
            this.zBasis = new Vector3(axis.z * axis.x * C - axis.y * s, axis.z * axis.y * C + axis.x * s, axis.z * axis.z * C + c);
        };

        Matrix.prototype.transformPoint = function (inVector) {
            return new Vector3(this.xBasis.multiply(inVector.x).x, this.yBasis.multiply(inVector.y).y, this.zBasis.multiply(inVector.z).z + this.origin.z);
        };

        Matrix.prototype.transformDirection = function (inVector) {
            var x = this.xBasis.multiply(inVector.x);
            var y = this.yBasis.multiply(inVector.y);
            var z = this.zBasis.multiply(inVector.z);
            return x.plus(y).plus(z);
        };

        Matrix.prototype.rigidInverse = function () {
            var rotInverse = new Matrix(new Vector3(this.xBasis.x, this.yBasis.x, this.zBasis.x), new Vector3(this.xBasis.y, this.yBasis.y, this.zBasis.y), new Vector3(this.xBasis.z, this.yBasis.z, this.zBasis.z));
            if (this.origin)
                rotInverse.origin = rotInverse.transformDirection(this.origin.opposite());
            return rotInverse;
        };

        Matrix.prototype.multiply = function (other) {
            var x = this.transformDirection(other.xBasis);
            var y = this.transformDirection(other.yBasis);
            var z = this.transformDirection(other.zBasis);
            var o = this.origin;

            if (this.origin && other.origin)
                o = this.transformPoint(other.origin);

            return new Matrix(x, y, z, o);
        };

        Matrix.prototype.multiplyAssign = function (other) {
            this.xBasis = this.transformDirection(other.xBasis);
            this.yBasis = this.transformDirection(other.yBasis);
            this.zBasis = this.transformDirection(other.zBasis);
            this.origin = this.transformPoint(other.origin);
            return this;
        };

        Matrix.prototype.isEqualTo = function (other) {
            if (!this.xBasis.isEqualTo(other.xBasis))
                return false;

            if (!this.yBasis.isEqualTo(other.yBasis))
                return false;

            if (!this.zBasis.isEqualTo(other.zBasis))
                return false;

            if (!this.origin.isEqualTo(other.origin))
                return false;

            return true;
        };

        Matrix.identity = function () {
            var xBasis = new Vector3(1, 0, 0);
            var yBasis = new Vector3(0, 1, 0);
            var zBasis = new Vector3(0, 0, 1);

            return new Matrix(xBasis, yBasis, zBasis);
        };

        Matrix.prototype.toString = function () {
            return "[Matrix xBasis:" + this.xBasis.toString() + " yBasis:" + this.yBasis.toString() + " zBasis:" + this.zBasis.toString() + " origin:" + this.origin.toString() + "]";
        };
        return Matrix;
    })();
    exports.Matrix = Matrix;

    var CircleGesture = (function (_super) {
        __extends(CircleGesture, _super);
        function CircleGesture() {
            _super.call(this);
            this.pointable = Pointable.invalid();
        }
        CircleGesture.classType = Type.TYPE_CIRCLE;
        return CircleGesture;
    })(Gesture);
    exports.CircleGesture = CircleGesture;

    var KeyTapGesture = (function (_super) {
        __extends(KeyTapGesture, _super);
        function KeyTapGesture() {
            _super.call(this);
            this.progress = 1;
        }
        KeyTapGesture.classType = Type.TYPE_KEY_TAP;
        return KeyTapGesture;
    })(Gesture);
    exports.KeyTapGesture = KeyTapGesture;

    var ScreenTapGesture = (function (_super) {
        __extends(ScreenTapGesture, _super);
        function ScreenTapGesture() {
            _super.call(this);
            this.progress = 1;
        }
        ScreenTapGesture.classType = Type.TYPE_SCREEN_TAP;
        return ScreenTapGesture;
    })(Gesture);
    exports.ScreenTapGesture = ScreenTapGesture;

    var SwipeGesture = (function (_super) {
        __extends(SwipeGesture, _super);
        function SwipeGesture() {
            _super.call(this);
        }
        SwipeGesture.classType = Type.TYPE_SWIPE;
        return SwipeGesture;
    })(Gesture);
    exports.SwipeGesture = SwipeGesture;

    var Vector3 = (function () {
        function Vector3(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        Vector3.prototype.opposite = function () {
            return new Vector3(-this.x, -this.y, -this.z);
        };

        Vector3.prototype.plus = function (other) {
            return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
        };

        Vector3.prototype.plusAssign = function (other) {
            this.x += other.x;
            this.y += other.y;
            this.z += other.z;
            return this;
        };

        Vector3.prototype.minus = function (other) {
            return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
        };

        Vector3.prototype.minusAssign = function (other) {
            this.x -= other.x;
            this.y -= other.y;
            this.z -= other.z;
            return this;
        };

        Vector3.prototype.multiply = function (scalar) {
            return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
        };

        Vector3.prototype.multiplyAssign = function (scalar) {
            this.x *= scalar;
            this.y *= scalar;
            this.z *= scalar;
            return this;
        };

        Vector3.prototype.divide = function (scalar) {
            return new Vector3(this.x / scalar, this.y / scalar, this.z / scalar);
        };

        Vector3.prototype.divideAssign = function (scalar) {
            this.x /= scalar;
            this.y /= scalar;
            this.z /= scalar;
            return this;
        };

        Vector3.prototype.isEqualTo = function (other) {
            return (this.x != other.x || this.y != other.y || this.z != other.z);
        };

        Vector3.prototype.angleTo = function (other) {
            var denom = this.magnitudeSquared() * other.magnitudeSquared();
            if (denom <= 0)
                return 0;

            return Math.acos(this.dot(other) / Math.sqrt(denom));
        };

        Vector3.prototype.cross = function (other) {
            return new Vector3((this.y * other.z) - (this.z * other.y), (this.z * other.x) - (this.x * other.z), (this.x * other.y) - (this.y * other.x));
        };

        Vector3.prototype.distanceTo = function (other) {
            return Math.sqrt((this.x - other.x) * (this.x - other.x) + (this.y - other.y) * (this.y - other.y) + (this.z - other.z) * (this.z - other.z));
        };

        Vector3.prototype.dot = function (other) {
            return (this.x * other.x) + (this.y * other.y) + (this.z * other.z);
        };

        Vector3.prototype.isValid = function () {
            return (this.x <= Number.MAX_VALUE && this.x >= -Number.MAX_VALUE) && (this.y <= Number.MAX_VALUE && this.y >= -Number.MAX_VALUE) && (this.z <= Number.MAX_VALUE && this.z >= -Number.MAX_VALUE);
        };

        Vector3.invalid = function () {
            return new Vector3(NaN, NaN, NaN);
        };

        Vector3.prototype.magnitude = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        };

        Vector3.prototype.magnitudeSquared = function () {
            return this.x * this.x + this.y * this.y + this.z * this.z;
        };

        Vector3.prototype.normalized = function () {
            var denom = this.magnitudeSquared();
            if (denom <= 0)
                return new Vector3(0, 0, 0);

            denom = 1 / Math.sqrt(denom);
            return new Vector3(this.x * denom, this.y * denom, this.z * denom);
        };

        Object.defineProperty(Vector3.prototype, "pitch", {
            get: function () {
                return Math.atan2(this.y, -this.z);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vector3.prototype, "yaw", {
            get: function () {
                return Math.atan2(this.x, -this.z);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vector3.prototype, "roll", {
            get: function () {
                return Math.atan2(this.x, -this.y);
            },
            enumerable: true,
            configurable: true
        });

        Vector3.zero = function () {
            return new Vector3(0, 0, 0);
        };

        Vector3.xAxis = function () {
            return new Vector3(1, 0, 0);
        };

        Vector3.yAxis = function () {
            return new Vector3(0, 1, 0);
        };

        Vector3.zAxis = function () {
            return new Vector3(0, 0, 1);
        };

        Vector3.left = function () {
            return new Vector3(-1, 0, 0);
        };

        Vector3.right = function () {
            return this.xAxis();
        };

        Vector3.down = function () {
            return new Vector3(0, -1, 0);
        };

        Vector3.up = function () {
            return this.yAxis();
        };

        Vector3.forward = function () {
            return new Vector3(0, 0, -1);
        };

        Vector3.backward = function () {
            return this.zAxis();
        };

        Vector3.prototype.toString = function () {
            return "[Vector3 x:" + this.x + " y:" + this.y + " z:" + this.z + "]";
        };
        return Vector3;
    })();
    exports.Vector3 = Vector3;
});
//@ sourceMappingURL=leapmotionts-0.8.0.js.map
