var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function(require, exports) {
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

    /**
    * LeapUtil is a collection of static utility functions.
    *
    */
    var LeapUtil = (function () {
        function LeapUtil() {
        }
        /**
        * Convert an angle measure from radians to degrees.
        *
        * @param radians
        * @return The value, in degrees.
        *
        */
        LeapUtil.toDegrees = function (radians) {
            return radians * 180 / Math.PI;
        };

        /**
        * Determines if a value is equal to or less than 0.00001.
        *
        * @return True, if equal to or less than 0.00001; false otherwise.
        */
        LeapUtil.isNearZero = function (value) {
            return Math.abs(value) <= LeapUtil.EPSILON;
        };

        /**
        * Determines if all Vector3 components is equal to or less than 0.00001.
        *
        * @return True, if equal to or less than 0.00001; false otherwise.
        */
        LeapUtil.vectorIsNearZero = function (inVector) {
            return this.isNearZero(inVector.x) && this.isNearZero(inVector.y) && this.isNearZero(inVector.z);
        };

        /**
        * Create a new matrix with just the rotation block from the argument matrix
        */
        LeapUtil.extractRotation = function (mtxTransform) {
            return new Matrix(mtxTransform.xBasis, mtxTransform.yBasis, mtxTransform.zBasis);
        };

        /**
        * Returns a matrix representing the inverse rotation by simple transposition of the rotation block.
        */
        LeapUtil.rotationInverse = function (mtxRot) {
            return new Matrix(new Vector3(mtxRot.xBasis.x, mtxRot.yBasis.x, mtxRot.zBasis.x), new Vector3(mtxRot.xBasis.y, mtxRot.yBasis.y, mtxRot.zBasis.y), new Vector3(mtxRot.xBasis.z, mtxRot.yBasis.z, mtxRot.zBasis.z));
        };

        /**
        * Returns a matrix that is the orthonormal inverse of the argument matrix.
        * This is only valid if the input matrix is orthonormal
        * (the basis vectors are mutually perpendicular and of length 1)
        */
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

        /**
        * Compute the polar/spherical heading of a vector direction in z/x plane
        */
        LeapUtil.heading = function (inVector) {
            return Math.atan2(inVector.z, inVector.x);
        };

        /**
        * Compute the spherical elevation of a vector direction in y above the z/x plane
        */
        LeapUtil.elevation = function (inVector) {
            return Math.atan2(inVector.y, Math.sqrt(inVector.z * inVector.z + inVector.x * inVector.x));
        };

        /**
        * Set magnitude to 1 and bring heading to [-Pi,Pi], elevation into [-Pi/2, Pi/2]
        *
        * @param vSpherical The Vector3 to convert.
        * @return The normalized spherical Vector3.
        *
        */
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

        /**
        * Convert from Cartesian (rectangular) coordinates to spherical coordinates
        * (magnitude, heading, elevation).
        *
        * @param vCartesian The Vector3 to convert.
        * @return The cartesian Vector3 converted to spherical.
        *
        */
        LeapUtil.cartesianToSpherical = function (vCartesian) {
            return new Vector3(vCartesian.magnitude(), this.heading(vCartesian), this.elevation(vCartesian));
        };

        /**
        * Convert from spherical coordinates (magnitude, heading, elevation) to
        * Cartesian (rectangular) coordinates.
        *
        * @param vSpherical The Vector3 to convert.
        * @return The spherical Vector3 converted to cartesian.
        *
        */
        LeapUtil.sphericalToCartesian = function (vSpherical) {
            var fMagnitude = vSpherical.x;
            var fCosHeading = Math.cos(vSpherical.y);
            var fSinHeading = Math.sin(vSpherical.y);
            var fCosElevation = Math.cos(vSpherical.z);
            var fSinElevation = Math.sin(vSpherical.z);

            return new Vector3(fCosHeading * fCosElevation * fMagnitude, fSinElevation * fMagnitude, fSinHeading * fCosElevation * fMagnitude);
        };

        /**
        * Clamps a value between a minimum Number and maximum Number value.
        *
        * @param inVal The number to clamp.
        * @param minVal The minimum value.
        * @param maxVal The maximum value.
        * @return The value clamped between minVal and maxVal.
        *
        */
        LeapUtil.clamp = function (inVal, minVal, maxVal) {
            return (inVal < minVal) ? minVal : ((inVal > maxVal) ? maxVal : inVal);
        };

        /**
        * Linearly interpolates between two Numbers.
        *
        * @param a A number.
        * @param b A number.
        * @param coefficient The interpolation coefficient [0-1].
        * @return The interpolated number.
        *
        */
        LeapUtil.lerp = function (a, b, coefficient) {
            return a + ((b - a) * coefficient);
        };

        /**
        * Linearly interpolates between two Vector3 objects.
        *
        * @param vec1 A Vector3 object.
        * @param vec2 A Vector3 object.
        * @param coefficient The interpolation coefficient [0-1].
        * @return A new interpolated Vector3 object.
        *
        */
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

    /**
    * The Controller class is your main interface to the Leap Motion Controller.
    *
    * <p>Create an instance of this Controller class to access frames of tracking
    * data and configuration information. Frame data can be polled at any time using
    * the <code>Controller::frame()</code> . Call <code>frame()</code> or <code>frame(0)</code>
    * to get the most recent frame. Set the history parameter to a positive integer
    * to access previous frames. A controller stores up to 60 frames in its frame history.</p>
    *
    * <p>Polling is an appropriate strategy for applications which already have an
    * intrinsic update loop, such as a game. You can also implement the Leap::Listener
    * interface to handle events as they occur. The Leap dispatches events to the listener
    * upon initialization and exiting, on connection changes, and when a new frame
    * of tracking data is available. When these events occur, the controller object
    * invokes the appropriate callback defined in the Listener interface.</p>
    *
    * <p>To access frames of tracking data as they become available:</p>
    *
    * <ul>
    * <li>Implement the Listener interface and override the <code>Listener::onFrame()</code> .</li>
    * <li>In your <code>Listener::onFrame()</code> , call the <code>Controller::frame()</code> to access the newest frame of tracking data.</li>
    * <li>To start receiving frames, create a Controller object and add event listeners to the <code>Controller::addEventListener()</code> .</li>
    * </ul>
    *
    * <p>When an instance of a Controller object has been initialized,
    * it calls the <code>Listener::onInit()</code> when the listener is ready for use.
    * When a connection is established between the controller and the Leap,
    * the controller calls the <code>Listener::onConnect()</code> . At this point,
    * your application will start receiving frames of data. The controller calls
    * the <code>Listener::onFrame()</code> each time a new frame is available.
    * If the controller loses its connection with the Leap software or
    * device for any reason, it calls the <code>Listener::onDisconnect()</code> .
    * If the listener is removed from the controller or the controller is destroyed,
    * it calls the <code>Listener::onExit()</code> . At that point, unless the listener
    * is added to another controller again, it will no longer receive frames of tracking data.</p>
    *
    * @author logotype
    *
    */
    var Controller = (function (_super) {
        __extends(Controller, _super);
        /**
        * Constructs a Controller object.
        * @param host IP or hostname of the computer running the Leap software.
        * (currently only supported for socket connections).
        *
        */
        function Controller(host) {
            if (typeof host === "undefined") { host = null; }
            var _this = this;
            _super.call(this);
            /**
            * @private
            * History of frame of tracking data from the Leap.
            */
            this.frameHistory = [];
            /**
            * @private
            * Reports whether this Controller is connected to the Leap Motion Controller.
            */
            this._isConnected = false;
            /**
            * @private
            * Reports whether gestures is enabled.
            */
            this._isGesturesEnabled = false;

            this.listener = new DefaultListener();

            if (!host) {
                this.connection = new WebSocket("ws://localhost:6437/v4.json");
            } else {
                this.connection = new WebSocket("ws://" + host + ":6437/v4.json");
            }

            this.listener.onInit(this);

            this.connection.onopen = function (event) {
                _this._isConnected = true;
                _this.listener.onConnect(_this);
                var focusedState = {};
                focusedState.focused = true;
                _this.connection.send(JSON.stringify(focusedState));
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

                json = JSON.parse(data.data);

                currentFrame = new Frame();
                currentFrame.controller = _this;

                // Hands
                if (typeof json.hands !== "undefined") {
                    i = 0;
                    length = json.hands.length;
                    for (i = 0; i < length; i++) {
                        hand = new Hand();
                        hand.frame = currentFrame;
                        hand.direction = new Vector3(json.hands[i].direction[0], json.hands[i].direction[1], json.hands[i].direction[2]);
                        hand.id = json.hands[i].id;
                        hand.palmNormal = new Vector3(json.hands[i].palmNormal[0], json.hands[i].palmNormal[1], json.hands[i].palmNormal[2]);
                        hand.palmPosition = new Vector3(json.hands[i].palmPosition[0], json.hands[i].palmPosition[1], json.hands[i].palmPosition[2]);
                        hand.stabilizedPalmPosition = new Vector3(json.hands[i].stabilizedPalmPosition[0], json.hands[i].stabilizedPalmPosition[1], json.hands[i].stabilizedPalmPosition[2]);
                        hand.palmVelocity = new Vector3(json.hands[i].palmPosition[0], json.hands[i].palmPosition[1], json.hands[i].palmPosition[2]);
                        hand.rotation = new Matrix(new Vector3(json.hands[i].r[0][0], json.hands[i].r[0][1], json.hands[i].r[0][2]), new Vector3(json.hands[i].r[1][0], json.hands[i].r[1][1], json.hands[i].r[1][2]), new Vector3(json.hands[i].r[2][0], json.hands[i].r[2][1], json.hands[i].r[2][2]));
                        hand.scaleFactorNumber = json.hands[i].s;
                        hand.sphereCenter = new Vector3(json.hands[i].sphereCenter[0], json.hands[i].sphereCenter[1], json.hands[i].sphereCenter[2]);
                        hand.sphereRadius = json.hands[i].sphereRadius;
                        hand.timeVisible = json.hands[i].timeVisible;
                        hand.translationVector = new Vector3(json.hands[i].t[0], json.hands[i].t[1], json.hands[i].t[2]);
                        currentFrame.hands.push(hand);
                    }
                }

                currentFrame.id = json.id;
                currentFrame.currentFramesPerSecond = json.currentFramesPerSecond;

                // InteractionBox
                if (typeof json.interactionBox !== "undefined") {
                    currentFrame.interactionBox = new InteractionBox();
                    currentFrame.interactionBox.center = new Vector3(json.interactionBox.center[0], json.interactionBox.center[1], json.interactionBox.center[2]);
                    currentFrame.interactionBox.width = json.interactionBox.size[0];
                    currentFrame.interactionBox.height = json.interactionBox.size[1];
                    currentFrame.interactionBox.depth = json.interactionBox.size[2];
                }

                // Pointables
                if (typeof json.pointables !== "undefined") {
                    i = 0;
                    length = json.pointables.length;
                    for (i = 0; i < length; i++) {
                        isTool = json.pointables[i].tool;
                        if (isTool)
                            pointable = new Tool();
                        else
                            pointable = new Finger();

                        pointable.frame = currentFrame;
                        pointable.id = json.pointables[i].id;
                        pointable.hand = Controller.getHandByID(currentFrame, json.pointables[i].handId);
                        pointable.length = json.pointables[i].length;
                        pointable.direction = new Vector3(json.pointables[i].direction[0], json.pointables[i].direction[1], json.pointables[i].direction[2]);
                        pointable.tipPosition = new Vector3(json.pointables[i].tipPosition[0], json.pointables[i].tipPosition[1], json.pointables[i].tipPosition[2]);
                        pointable.stabilizedTipPosition = new Vector3(json.pointables[i].stabilizedTipPosition[0], json.pointables[i].stabilizedTipPosition[1], json.pointables[i].stabilizedTipPosition[2]);
                        pointable.tipVelocity = new Vector3(json.pointables[i].tipVelocity[0], json.pointables[i].tipVelocity[1], json.pointables[i].tipVelocity[2]);
                        pointable.touchDistance = json.pointables[i].touchDistance;
                        pointable.timeVisible = json.pointables[i].timeVisible;
                        currentFrame.pointables.push(pointable);

                        switch (json.pointables[i].touchZone) {
                            case "hovering":
                                pointable.touchZone = 1 /* ZONE_HOVERING */;
                                break;
                            case "touching":
                                pointable.touchZone = 2 /* ZONE_TOUCHING */;
                                break;
                            default:
                                pointable.touchZone = 0 /* ZONE_NONE */;
                                break;
                        }

                        if (pointable.hand)
                            pointable.hand.pointables.push(pointable);

                        if (isTool) {
                            pointable.isTool = true;
                            pointable.isFinger = false;
                            pointable.width = json.pointables[i].width;
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

                // Gestures
                if (typeof json.gestures !== "undefined") {
                    i = 0;
                    length = json.gestures.length;
                    for (i = 0; i < length; i++) {
                        switch (json.gestures[i].type) {
                            case "circle":
                                gesture = new CircleGesture();
                                type = 6 /* TYPE_CIRCLE */;
                                var circle = gesture;

                                circle.center = new Vector3(json.gestures[i].center[0], json.gestures[i].center[1], json.gestures[i].center[2]);
                                circle.normal = new Vector3(json.gestures[i].normal[0], json.gestures[i].normal[1], json.gestures[i].normal[2]);
                                circle.progress = json.gestures[i].progress;
                                circle.radius = json.gestures[i].radius;
                                break;

                            case "swipe":
                                gesture = new SwipeGesture();
                                type = 5 /* TYPE_SWIPE */;

                                var swipe = gesture;

                                swipe.startPosition = new Vector3(json.gestures[i].startPosition[0], json.gestures[i].startPosition[1], json.gestures[i].startPosition[2]);
                                swipe.position = new Vector3(json.gestures[i].position[0], json.gestures[i].position[1], json.gestures[i].position[2]);
                                swipe.direction = new Vector3(json.gestures[i].direction[0], json.gestures[i].direction[1], json.gestures[i].direction[2]);
                                swipe.speed = json.gestures[i].speed;
                                break;

                            case "screenTap":
                                gesture = new ScreenTapGesture();
                                type = 7 /* TYPE_SCREEN_TAP */;

                                var screenTap = gesture;
                                screenTap.position = new Vector3(json.gestures[i].position[0], json.gestures[i].position[1], json.gestures[i].position[2]);
                                screenTap.direction = new Vector3(json.gestures[i].direction[0], json.gestures[i].direction[1], json.gestures[i].direction[2]);
                                screenTap.progress = json.gestures[i].progress;
                                break;

                            case "keyTap":
                                gesture = new KeyTapGesture();
                                type = 8 /* TYPE_KEY_TAP */;

                                var keyTap = gesture;
                                keyTap.position = new Vector3(json.gestures[i].position[0], json.gestures[i].position[1], json.gestures[i].position[2]);
                                keyTap.direction = new Vector3(json.gestures[i].direction[0], json.gestures[i].direction[1], json.gestures[i].direction[2]);
                                keyTap.progress = json.gestures[i].progress;
                                break;

                            default:
                                throw new Error("unkown gesture type");
                        }

                        var j = 0;
                        var lengthInner = 0;

                        if (typeof json.gestures[i].handIds !== "undefined") {
                            j = 0;
                            lengthInner = json.gestures[i].handIds.length;
                            for (j = 0; j < lengthInner; ++j) {
                                var gestureHand = Controller.getHandByID(currentFrame, json.gestures[i].handIds[j]);
                                gesture.hands.push(gestureHand);
                            }
                        }

                        if (typeof json.gestures[i].pointableIds !== "undefined") {
                            j = 0;
                            lengthInner = json.gestures[i].pointableIds.length;
                            for (j = 0; j < lengthInner; ++j) {
                                var gesturePointable = Controller.getPointableByID(currentFrame, json.gestures[i].pointableIds[j]);
                                if (gesturePointable) {
                                    gesture.pointables.push(gesturePointable);
                                }
                            }
                            if (gesture instanceof CircleGesture && gesture.pointables.length > 0) {
                                gesture.pointable = gesture.pointables[0];
                            }
                        }

                        gesture.frame = currentFrame;
                        gesture.id = json.gestures[i].id;
                        gesture.duration = json.gestures[i].duration;
                        gesture.durationSeconds = gesture.duration / 1000000;

                        switch (json.gestures[i].state) {
                            case "start":
                                gesture.state = 1 /* STATE_START */;
                                break;
                            case "update":
                                gesture.state = 2 /* STATE_UPDATE */;
                                break;
                            case "stop":
                                gesture.state = 3 /* STATE_STOP */;
                                break;
                            default:
                                gesture.state = 0 /* STATE_INVALID */;
                        }

                        gesture.type = type;

                        currentFrame._gestures.push(gesture);
                    }
                }

                // Rotation (since last frame), interpolate for smoother motion
                if (json.r)
                    currentFrame.rotation = new Matrix(new Vector3(json.r[0][0], json.r[0][1], json.r[0][2]), new Vector3(json.r[1][0], json.r[1][1], json.r[1][2]), new Vector3(json.r[2][0], json.r[2][1], json.r[2][2]));

                // Scale factor (since last frame), interpolate for smoother motion
                currentFrame.scaleFactorNumber = json.s;

                // Translation (since last frame), interpolate for smoother motion
                if (json.t)
                    currentFrame.translationVector = new Vector3(json.t[0], json.t[1], json.t[2]);

                // Timestamp
                currentFrame.timestamp = json.timestamp;

                // Add frame to history
                if (_this.frameHistory.length > 59)
                    _this.frameHistory.splice(59, 1);

                _this.frameHistory.unshift(_this.latestFrame);
                _this.latestFrame = currentFrame;
                _this.listener.onFrame(_this, _this.latestFrame);
            };
        }
        /**
        * Finds a Hand object by ID.
        *
        * @param frame The Frame object in which the Hand contains
        * @param id The ID of the Hand object
        * @return The Hand object if found, otherwise null
        *
        */
        Controller.getHandByID = function (frame, id) {
            var returnValue = null;
            var i = 0;

            for (i = 0; i < frame.hands.length; i++) {
                if (frame.hands[i].id === id) {
                    returnValue = frame.hands[i];
                    break;
                }
            }
            return returnValue;
        };

        /**
        * Finds a Pointable object by ID.
        *
        * @param frame The Frame object in which the Pointable contains
        * @param id The ID of the Pointable object
        * @return The Pointable object if found, otherwise null
        *
        */
        Controller.getPointableByID = function (frame, id) {
            var returnValue = null;
            var i = 0;

            for (i = 0; i < frame.pointables.length; i++) {
                if (frame.pointables[i].id === id) {
                    returnValue = frame.pointables[i];
                    break;
                }
            }
            return returnValue;
        };

        /**
        * Returns a frame of tracking data from the Leap.
        *
        * <p>Use the optional history parameter to specify which frame to retrieve.
        * Call <code>frame()</code> or <code>frame(0)</code> to access the most recent frame;
        * call <code>frame(1)</code> to access the previous frame, and so on. If you use a history value
        * greater than the number of stored frames, then the controller returns
        * an invalid frame.</p>
        *
        * @param history The age of the frame to return, counting backwards from
        * the most recent frame (0) into the past and up to the maximum age (59).
        *
        * @return The specified frame; or, if no history parameter is specified,
        * the newest frame. If a frame is not available at the specified
        * history position, an invalid Frame is returned.
        *
        */
        Controller.prototype.frame = function (history) {
            if (typeof history === "undefined") { history = 0; }
            if (history >= this.frameHistory.length)
                return Frame.invalid();
            else
                return this.frameHistory[history];
        };

        /**
        * Update the object that receives direct updates from the Leap Motion Controller.
        *
        * <p>The default listener will make the controller dispatch flash events.
        * You can override this behaviour, by implementing the IListener interface
        * in your own classes, and use this method to set the listener to your
        * own implementation.</p>
        *
        * @param listener
        */
        Controller.prototype.setListener = function (listener) {
            this.listener = listener;
        };

        /**
        * Enables or disables reporting of a specified gesture type.
        *
        * <p>By default, all gesture types are disabled. When disabled, gestures of
        * the disabled type are never reported and will not appear in the frame
        * gesture list.</p>
        *
        * <p>As a performance optimization, only enable recognition for the types
        * of movements that you use in your application.</p>
        *
        * @param type The type of gesture to enable or disable. Must be a member of the Gesture::Type enumeration.
        * @param enable True, to enable the specified gesture type; False, to disable.
        *
        */
        Controller.prototype.enableGesture = function (type, enable) {
            if (typeof enable === "undefined") { enable = true; }
            var enableObject = {};

            if (enable) {
                this._isGesturesEnabled = true;
                enableObject.enableGestures = true;
            } else {
                this._isGesturesEnabled = false;
                enableObject.enableGestures = false;
            }

            this.connection.send(JSON.stringify(enableObject));
        };

        /**
        * Reports whether the specified gesture type is enabled.
        *
        * @param type The Gesture.TYPE parameter.
        * @return True, if the specified type is enabled; false, otherwise.
        *
        */
        Controller.prototype.isGestureEnabled = function (type) {
            return this._isGesturesEnabled;
        };

        /**
        * Reports whether this Controller is connected to the Leap Motion Controller.
        *
        * <p>When you first create a Controller object, <code>isConnected()</code> returns false.
        * After the controller finishes initializing and connects to
        * the Leap, <code>isConnected()</code> will return true.</p>
        *
        * <p>You can either handle the onConnect event using a event listener
        * or poll the <code>isConnected()</code> if you need to wait for your
        * application to be connected to the Leap before performing
        * some other operation.</p>
        *
        * @return True, if connected; false otherwise.
        *
        */
        Controller.prototype.isConnected = function () {
            return this._isConnected;
        };
        return Controller;
    })(EventDispatcher);
    exports.Controller = Controller;

    /**
    * The InteractionBox class represents a box-shaped region completely within
    * the field of view of the Leap Motion controller.
    *
    * <p>The interaction box is an axis-aligned rectangular prism and provides
    * normalized coordinates for hands, fingers, and tools within this box.
    * The InteractionBox class can make it easier to map positions in the
    * Leap Motion coordinate system to 2D or 3D coordinate systems used
    * for application drawing.</p>
    *
    * <p>The InteractionBox region is defined by a center and dimensions along the x, y, and z axes.</p>
    *
    * @author logotype
    *
    */
    var InteractionBox = (function () {
        function InteractionBox() {
        }
        /**
        * Converts a position defined by normalized InteractionBox coordinates
        * into device coordinates in millimeters.
        *
        * This function performs the inverse of normalizePoint().
        *
        * @param normalizedPosition The input position in InteractionBox coordinates.
        * @return The corresponding denormalized position in device coordinates.
        *
        */
        InteractionBox.prototype.denormalizePoint = function (normalizedPosition) {
            var vec = Vector3.invalid();

            vec.x = (normalizedPosition.x - 0.5) * this.width + this.center.x;
            vec.y = (normalizedPosition.y - 0.5) * this.height + this.center.y;
            vec.z = (normalizedPosition.z - 0.5) * this.depth + this.center.z;

            return vec;
        };

        /**
        * Normalizes the coordinates of a point using the interaction box.
        *
        * <p>Coordinates from the Leap Motion frame of reference (millimeters) are
        * converted to a range of [0..1] such that the minimum value of the
        * InteractionBox maps to 0 and the maximum value of the InteractionBox maps to 1.</p>
        *
        * @param position The input position in device coordinates.
        * @param clamp Whether or not to limit the output value to the range [0,1]
        * when the input position is outside the InteractionBox. Defaults to true.
        * @return The normalized position.
        *
        */
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

        /**
        * Reports whether this is a valid InteractionBox object.
        * @return True, if this InteractionBox object contains valid data.
        *
        */
        InteractionBox.prototype.isValid = function () {
            return this.center.isValid() && this.width > 0 && this.height > 0 && this.depth > 0;
        };

        /**
        * Compare InteractionBox object equality/inequality.
        *
        * <p>Two InteractionBox objects are equal if and only if both InteractionBox
        * objects represent the exact same InteractionBox and both InteractionBoxes are valid.</p>
        *
        * @param other
        * @return
        *
        */
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

        /**
        * Returns an invalid InteractionBox object.
        *
        * <p>You can use the instance returned by this function in comparisons
        * testing whether a given InteractionBox instance is valid or invalid.
        * (You can also use the <code>InteractionBox.isValid()</code> function.)</p>
        *
        * @return The invalid InteractionBox instance.
        *
        */
        InteractionBox.invalid = function () {
            return new InteractionBox();
        };

        /**
        * Writes a brief, human readable description of the InteractionBox object.
        * @return A description of the InteractionBox as a string.
        *
        */
        InteractionBox.prototype.toString = function () {
            return "[InteractionBox depth:" + this.depth + " height:" + this.height + " width:" + this.width + "]";
        };
        return InteractionBox;
    })();
    exports.InteractionBox = InteractionBox;

    /**
    * The Pointable class reports the physical characteristics of a detected finger or tool.
    * Both fingers and tools are classified as Pointable objects. Use the Pointable.isFinger
    * property to determine whether a Pointable object represents a finger. Use the
    * Pointable.isTool property to determine whether a Pointable object represents a tool.
    * The Leap classifies a detected entity as a tool when it is thinner, straighter,
    * and longer than a typical finger.
    *
    * <p>Note that Pointable objects can be invalid, which means that they do not contain valid
    * tracking data and do not correspond to a physical entity. Invalid Pointable objects
    * can be the result of asking for a Pointable object using an ID from an earlier frame
    * when no Pointable objects with that ID exist in the current frame. A Pointable object
    * created from the Pointable constructor is also invalid. Test for validity with
    * the <code>Pointable.isValid()</code> function.</p>
    *
    * @author logotype
    *
    */
    /**
    * Defines the values for reporting the state of a Pointable object in relation to an adaptive touch plane.
    */
    (function (Zone) {
        /**
        * The Pointable object is too far from the plane to be considered hovering or touching.
        *
        * <p>Defines the values for reporting the state of a Pointable object in relation to an adaptive touch plane.</p>
        */
        Zone[Zone["ZONE_NONE"] = 0] = "ZONE_NONE";

        /**
        * The Pointable object is close to, but not touching the plane.
        *
        * <p>Defines the values for reporting the state of a Pointable object in relation to an adaptive touch plane.</p>
        */
        Zone[Zone["ZONE_HOVERING"] = 1] = "ZONE_HOVERING";

        /**
        * The Pointable has penetrated the plane.
        *
        * <p>Defines the values for reporting the state of a Pointable object in relation to an adaptive touch plane.</p>
        */
        Zone[Zone["ZONE_TOUCHING"] = 2] = "ZONE_TOUCHING";
    })(exports.Zone || (exports.Zone = {}));
    var Zone = exports.Zone;

    var Pointable = (function () {
        function Pointable() {
            /**
            * The current touch zone of this Pointable object.
            *
            * <p>The Leap Motion software computes the touch zone based on a
            * floating touch plane that adapts to the user's finger movement
            * and hand posture. The Leap Motion software interprets purposeful
            * movements toward this plane as potential touch points.
            * When a Pointable moves close to the adaptive touch plane,
            * it enters the "hovering" zone. When a Pointable reaches or
            * passes through the plane, it enters the "touching" zone.</p>
            *
            * <p>The possible states are present in the Zone enum of this class:</p>
            *
            * <code>Zone.NONE – The Pointable is outside the hovering zone.
            * Zone.HOVERING – The Pointable is close to, but not touching the touch plane.
            * Zone.TOUCHING – The Pointable has penetrated the touch plane.</code>
            *
            * <p>The touchDistance value provides a normalized indication of the
            * distance to the touch plane when the Pointable is in the hovering
            * or touching zones.</p>
            *
            */
            this.touchZone = 0 /* ZONE_NONE */;
            /**
            * A value proportional to the distance between this Pointable
            * object and the adaptive touch plane.
            *
            * <p>The touch distance is a value in the range [-1, 1].
            * The value 1.0 indicates the Pointable is at the far edge of
            * the hovering zone. The value 0 indicates the Pointable is
            * just entering the touching zone. A value of -1.0 indicates
            * the Pointable is firmly within the touching zone.
            * Values in between are proportional to the distance from the plane.
            * Thus, the touchDistance of 0.5 indicates that the Pointable
            * is halfway into the hovering zone.</p>
            *
            * <p>You can use the touchDistance value to modulate visual
            * feedback given to the user as their fingers close in on a
            * touch target, such as a button.</p>
            *
            */
            this.touchDistance = 0;
            /**
            * The estimated length of the finger or tool in millimeters.
            *
            * <p>The reported length is the visible length of the finger or tool from
            * the hand to tip.</p>
            *
            * <p>If the length isn't known, then a value of 0 is returned.</p>
            */
            this.length = 0;
            /**
            * The estimated width of the finger or tool in millimeters.
            *
            * <p>The reported width is the average width of the visible portion
            * of the finger or tool from the hand to the tip.</p>
            *
            * <p>If the width isn't known, then a value of 0 is returned.</p>
            */
            this.width = 0;
            this.direction = Vector3.invalid();
            this.tipPosition = Vector3.invalid();
            this.tipVelocity = Vector3.invalid();
        }
        /**
        * Reports whether this is a valid Pointable object.
        * @return True if <code>direction</code>, <code>tipPosition</code> and <code>tipVelocity</code> are true.
        */
        Pointable.prototype.isValid = function () {
            var returnValue = false;

            if ((this.direction && this.direction.isValid()) && (this.tipPosition && this.tipPosition.isValid()) && (this.tipVelocity && this.tipVelocity.isValid()))
                returnValue = true;

            return returnValue;
        };

        /**
        * Compare Pointable object equality/inequality.
        *
        * <p>Two Pointable objects are equal if and only if both Pointable
        * objects represent the exact same physical entities in
        * the same frame and both Pointable objects are valid.</p>
        *
        * @param other The Pointable to compare with.
        * @return True; if equal, False otherwise.
        *
        */
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

        /**
        * Returns an invalid Pointable object.
        *
        * <p>You can use the instance returned by this in
        * comparisons testing whether a given Pointable instance
        * is valid or invalid.<br/>
        * (You can also use the <code>Pointable.isValid()</code> function.)</p>
        *
        * @return The invalid Pointable instance.
        *
        */
        Pointable.invalid = function () {
            return new Pointable();
        };

        /**
        * A string containing a brief, human readable description of the Pointable object.
        */
        Pointable.prototype.toString = function () {
            return "[Pointable direction: " + this.direction + " tipPosition: " + this.tipPosition + " tipVelocity: " + this.tipVelocity + "]";
        };
        return Pointable;
    })();
    exports.Pointable = Pointable;

    /**
    * The Gesture class represents a recognized movement by the user.
    *
    * <p>The Leap watches the activity within its field of view for certain movement
    * patterns typical of a user gesture or command. For example, a movement from
    * side to side with the hand can indicate a swipe gesture, while a finger poking
    * forward can indicate a screen tap gesture.</p>
    *
    * <p>When the Leap recognizes a gesture, it assigns an ID and adds a Gesture object
    * to the frame gesture list. For continuous gestures, which occur over many frames,
    * the Leap updates the gesture by adding a Gesture object having the same ID and
    * updated properties in each subsequent frame.</p>
    *
    * <p><strong>Important: Recognition for each type of gesture must be enabled using the
    * <code>Controller.enableGesture()</code> function; otherwise no gestures are recognized
    * or reported.</strong></p>
    *
    * <p>Subclasses of Gesture define the properties for the specific movement
    * patterns recognized by the Leap.</p>
    *
    * <p>The Gesture subclasses for include:
    * <pre>
    * CircleGesture – A circular movement by a finger.
    * SwipeGesture – A straight line movement by the hand with fingers extended.
    * ScreenTapGesture – A forward tapping movement by a finger.
    * KeyTapGesture – A downward tapping movement by a finger.
    * </pre>
    * </p>
    *
    * <p>Circle and swipe gestures are continuous and these objects can have a state
    * of start, update, and stop.</p>
    *
    * <p>The screen tap gesture is a discrete gesture. The Leap only creates a single
    * ScreenTapGesture object appears for each tap and it always has a stop state.</p>
    *
    * <p>Get valid Gesture instances from a Frame object. You can get a list of gestures
    * with the <code>Frame.gestures()</code> method. You can get a list of gestures since a specified
    * frame with the <code>Frame.gestures(frame)</code> methods. You can also use the <code>Frame.gesture()</code>
    * method to find a gesture in the current frame using an ID value obtained
    * in a previous frame.</p>
    *
    * <p>Gesture objects can be invalid. For example, when you get a gesture by ID using
    * <code>Frame.gesture()</code>, and there is no gesture with that ID in the current frame, then
    * <code>gesture()</code> returns an Invalid Gesture object (rather than a null value).
    * Always check object validity in situations where a gesture might be invalid.</p>
    *
    * <p>The following keys can be used with the Config class to configure the gesture recognizer:</p>
    *
    * <table class="innertable">
    *   <tr>
    *    <th>Key string</th>
    *    <th>Value type</th>
    *    <th>Default value</th>
    *    <th>Units</th>
    *  </tr>
    *   <tr>
    *    <td>Gesture.Circle.MinRadius</td>
    *    <td>float</td>
    *    <td>5.0</td>
    *    <td>mm</td>
    *  </tr>
    *   <tr>
    *    <td>Gesture.Circle.MinArc</td>
    *    <td>float</td>
    *    <td>1.5&#42;pi</td>
    *    <td>radians</td>
    *  </tr>
    *   <tr>
    *    <td>Gesture.Swipe.MinLength</td>
    *    <td>float</td>
    *    <td>150</td>
    *    <td>mm</td>
    *  </tr>
    *   <tr>
    *    <td>Gesture.Swipe.MinVelocity</td>
    *    <td>float</td>
    *    <td>1000</td>
    *    <td>mm/s</td>
    *  </tr>
    *   <tr>
    *    <td>Gesture.KeyTap.MinDownVelocity</td>
    *    <td>float</td>
    *    <td>50</td>
    *    <td>mm/s</td>
    *  </tr>
    *   <tr>
    *    <td>Gesture.KeyTap.HistorySeconds</td>
    *    <td>float</td>
    *    <td>0.1</td>
    *    <td>s</td>
    *  </tr>
    *   <tr>
    *    <td>Gesture.KeyTap.MinDistance</td>
    *    <td>float</td>
    *    <td>5.0</td>
    *    <td>mm</td>
    *  </tr>
    *   <tr>
    *    <td>Gesture.ScreenTap.MinForwardVelocity</td>
    *    <td>float</td>
    *    <td>50</td>
    *    <td>mm/s</td>
    *  </tr>
    *   <tr>
    *    <td>Gesture.ScreenTap.HistorySeconds</td>
    *    <td>float</td>
    *    <td>0.1</td>
    *    <td>s</td>
    *  </tr>
    *   <tr>
    *    <td>Gesture.ScreenTap.MinDistance</td>
    *    <td>float</td>
    *    <td>3.0</td>
    *    <td>mm</td>
    *  </tr>
    * </table>
    *
    * @author logotype
    * @see CircleGesture
    * @see SwipeGesture
    * @see ScreenTapGesture
    * @see KeyTapGesture
    * @see Config
    *
    */
    /**
    * The possible gesture states.
    */
    (function (State) {
        /**
        * An invalid state.
        */
        State[State["STATE_INVALID"] = 0] = "STATE_INVALID";

        /**
        * The gesture is starting.<br/>
        * Just enough has happened to recognize it.
        */
        State[State["STATE_START"] = 1] = "STATE_START";

        /**
        * The gesture is in progress.<br/>
        * (Note: not all gestures have updates).
        */
        State[State["STATE_UPDATE"] = 2] = "STATE_UPDATE";

        /**
        * The gesture has completed or stopped.
        */
        State[State["STATE_STOP"] = 3] = "STATE_STOP";
    })(exports.State || (exports.State = {}));
    var State = exports.State;

    /**
    * The supported types of gestures.
    */
    (function (Type) {
        /**
        * An invalid type.
        */
        Type[Type["TYPE_INVALID"] = 4] = "TYPE_INVALID";

        /**
        * A straight line movement by the hand with fingers extended.
        */
        Type[Type["TYPE_SWIPE"] = 5] = "TYPE_SWIPE";

        /**
        * A circular movement by a finger.
        */
        Type[Type["TYPE_CIRCLE"] = 6] = "TYPE_CIRCLE";

        /**
        * A forward tapping movement by a finger.
        */
        Type[Type["TYPE_SCREEN_TAP"] = 7] = "TYPE_SCREEN_TAP";

        /**
        * A downward tapping movement by a finger.
        */
        Type[Type["TYPE_KEY_TAP"] = 8] = "TYPE_KEY_TAP";
    })(exports.Type || (exports.Type = {}));
    var Type = exports.Type;
    var Gesture = (function () {
        /**
        * Constructs a new Gesture object.
        *
        * <p>An uninitialized Gesture object is considered invalid. Get valid
        * instances of the Gesture class, which will be one of the Gesture
        * subclasses, from a Frame object.</p>
        *
        */
        function Gesture() {
            /**
            * The list of hands associated with this Gesture, if any.
            *
            * <p>If no hands are related to this gesture, the list is empty.</p>
            */
            this.hands = [];
            /**
            * The list of fingers and tools associated with this Gesture, if any.
            *
            * <p>If no Pointable objects are related to this gesture, the list is empty.</p>
            */
            this.pointables = [];
        }
        /**
        * Compare Gesture object equality/inequality.
        *
        * <p>Two Gestures are equal if they represent the same snapshot of
        * the same recognized movement.</p>
        *
        * @param other The Gesture to compare with.
        * @return True; if equal, False otherwise.
        *
        */
        Gesture.prototype.isEqualTo = function (other) {
            return (this.id == other.id);
        };

        /**
        * Reports whether this Gesture instance represents a valid Gesture.
        *
        * <p>An invalid Gesture object does not represent a snapshot of a recognized
        * movement. Invalid Gesture objects are returned when a valid object
        * cannot be provided. For example, when you get an gesture by ID using
        * Frame.gesture(), and there is no gesture with that ID in the current
        * frame, then gesture() returns an Invalid Gesture object (rather than
        * a null value). Always check object validity in situations where an
        * gesture might be invalid.</p>
        *
        * @return True, if this is a valid Gesture instance; false, otherwise.
        *
        */
        Gesture.prototype.isValid = function () {
            if (!this.durationSeconds)
                return false;

            return true;
        };

        /**
        * Returns an invalid Gesture object.
        *
        * <p>You can use the instance returned by this in comparisons
        * testing whether a given Gesture instance is valid or invalid.
        * (You can also use the <code>Gesture.isValid()</code> function.)</p>
        *
        * @return The invalid Gesture instance.
        *
        */
        Gesture.invalid = function () {
            return new Gesture();
        };

        /**
        * A string containing a brief, human-readable description of this Gesture.
        *
        */
        Gesture.prototype.toString = function () {
            return "[Gesture id:" + this.id + " duration:" + this.duration + " type:" + this.type + "]";
        };
        return Gesture;
    })();
    exports.Gesture = Gesture;

    /**
    * The Finger class represents a tracked finger.
    *
    * <p>Fingers are Pointable objects that the Leap has classified as a finger.
    * Get valid Finger objects from a Frame or a Hand object.</p>
    *
    * <p>Note that Finger objects can be invalid, which means that they do not
    * contain valid tracking data and do not correspond to a physical finger.
    * Invalid Finger objects can be the result of asking for a Finger object
    * using an ID from an earlier frame when no Finger objects with that ID
    * exist in the current frame. A Finger object created from the Finger
    * constructor is also invalid.<br/>
    * Test for validity with the <code>Finger.sValid()</code> function.</p>
    *
    * @author logotype
    *
    */
    var Finger = (function (_super) {
        __extends(Finger, _super);
        /**
        * Constructs a Finger object.
        *
        * <p>An uninitialized finger is considered invalid.
        * Get valid Finger objects from a Frame or a Hand object.</p>
        *
        */
        function Finger() {
            _super.call(this);
            this.isFinger = true;
            this.isTool = false;
        }
        /**
        * Returns an invalid Finger object.
        *
        * <p>You can use the instance returned by this function in
        * comparisons testing whether a given Finger instance
        * is valid or invalid.
        * (You can also use the <code>Finger.isValid()</code> function.)</p>
        *
        * @return The invalid Finger instance.
        *
        */
        Finger.invalid = function () {
            return new Finger();
        };
        return Finger;
    })(Pointable);
    exports.Finger = Finger;

    /**
    * The Tool class represents a tracked tool.
    *
    * <p>Tools are Pointable objects that the Leap has classified as a tool.
    * Tools are longer, thinner, and straighter than a typical finger.
    * Get valid Tool objects from a Frame or a Hand object.</p>
    *
    * <p>Note that Tool objects can be invalid, which means that they do not
    * contain valid tracking data and do not correspond to a physical tool.
    * Invalid Tool objects can be the result of asking for a Tool object
    * using an ID from an earlier frame when no Tool objects with that ID
    * exist in the current frame. A Tool object created from the Tool
    * constructor is also invalid. Test for validity with the
    * <code>Tool.isValid()</code> function.</p>
    *
    * @author logotype
    *
    */
    var Tool = (function (_super) {
        __extends(Tool, _super);
        function Tool() {
            _super.call(this);
            this.isFinger = false;
            this.isTool = true;
        }
        /**
        * Returns an invalid Tool object.
        *
        * <p>You can use the instance returned by this function in
        * comparisons testing whether a given Tool instance
        * is valid or invalid.
        * (You can also use the Tool.isValid property.)</p>
        *
        * @return The invalid Tool instance.
        *
        */
        Tool.invalid = function () {
            return new Tool();
        };
        return Tool;
    })(Pointable);
    exports.Tool = Tool;

    /**
    * The Hand class reports the physical characteristics of a detected hand.
    *
    * <p>Hand tracking data includes a palm position and velocity; vectors for
    * the palm normal and direction to the fingers; properties of a sphere fit
    * to the hand; and lists of the attached fingers and tools.</p>
    *
    * <p>Note that Hand objects can be invalid, which means that they do not
    * contain valid tracking data and do not correspond to a physical entity.
    * Invalid Hand objects can be the result of asking for a Hand object using
    * an ID from an earlier frame when no Hand objects with that ID exist in
    * the current frame. A Hand object created from the Hand constructor is
    * also invalid. Test for validity with the <code>Hand.isValid()</code> function.</p>
    *
    * @author logotype
    *
    */
    var Hand = (function () {
        /**
        * Constructs a Hand object.
        *
        * <p>An uninitialized hand is considered invalid.
        *
        * Get valid Hand objects from a Frame object.</p>
        *
        */
        function Hand() {
            /**
            * The list of Finger objects detected in this frame that are attached
            * to this hand, given in arbitrary order.
            * @see Finger
            */
            this.fingers = [];
            /**
            * The list of Pointable objects (fingers and tools) detected in this
            * frame that are associated with this hand, given in arbitrary order.
            *
            * <p>The list can be empty if no fingers or tools associated with this hand are detected.
            * Use the <code>Pointable.isFinger()</code> to determine whether or not an item in the
            * list represents a finger. Use the <code>Pointable.isTool()</code> to determine
            * whether or not an item in the list represents a tool. You can also get
            * only fingers using the <code>Hand.fingers()</code> or only tools using
            * the <code>Hand.tools()</code> function.</p>
            *
            * @see Pointable
            *
            */
            this.pointables = [];
            /**
            * The list of Tool objects detected in this frame that are held by this hand, given in arbitrary order.
            * @see Tool
            */
            this.tools = [];
        }
        /**
        * Reports whether this is a valid Hand object.
        * @return True, if this Hand object contains valid tracking data.
        *
        */
        Hand.prototype.isValid = function () {
            if ((this.direction && this.direction.isValid()) && (this.palmNormal && this.palmNormal.isValid()) && (this.palmPosition && this.palmPosition.isValid()) && (this.palmVelocity && this.palmVelocity.isValid()) && (this.sphereCenter && this.sphereCenter.isValid()))
                return true;

            return false;
        };

        /**
        * Compare Hand object equality/inequality.
        *
        * <p>Two Hand objects are equal if and only if both Hand objects
        * represent the exact same physical hand in the same frame
        * and both Hand objects are valid.</p>
        *
        * @param other The Hand object to compare with.
        * @return True; if equal. False otherwise.
        *
        */
        Hand.prototype.isEqualTo = function (other) {
            if (this.id === other.id && this.frame === other.frame && this.isValid() && other.isValid())
                return true;

            return false;
        };

        /**
        * The Finger object with the specified ID attached to this hand.
        *
        * <p>Use the <code>Hand.finger()</code> to retrieve a Finger object attached
        * to this hand using an ID value obtained from a previous frame.
        * This always returns a Finger object, but if no finger
        * with the specified ID is present, an invalid Finger object is returned.</p>
        *
        * <p>Note that ID values persist across frames, but only until tracking of
        * a particular object is lost. If tracking of a finger is lost and
        * subsequently regained, the new Finger object representing that
        * finger may have a different ID than that representing the finger in an earlier frame.</p>
        *
        * @param id The ID value of a Finger object from a previous frame.
        * @return The Finger object with the matching ID if one exists for
        * this hand in this frame; otherwise, an invalid Finger object is returned.
        * @see Finger
        *
        */
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

        /**
        * The Tool object with the specified ID held by this hand.
        *
        * <p>Use the <code>Hand.tool()</code> to retrieve a Tool object held
        * by this hand using an ID value obtained from a previous frame.
        * This always returns a Tool object, but if no tool
        * with the specified ID is present, an invalid Tool object is returned.</p>
        *
        * <p>Note that ID values persist across frames, but only until
        * tracking of a particular object is lost. If tracking of a tool
        * is lost and subsequently regained, the new Tool object
        * representing that tool may have a different ID than that
        * representing the tool in an earlier frame.</p>
        *
        * @param id The ID value of a Tool object from a previous frame.
        * @return The Tool object with the matching ID if one exists for
        * this hand in this frame; otherwise, an invalid Tool object is returned.
        * @see Tool
        *
        */
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

        /**
        * The Pointable object with the specified ID associated with this hand.
        *
        * <p>Use the <code>Hand.pointable()</code> to retrieve a Pointable object
        * associated with this hand using an ID value obtained from a previous frame.
        * This always returns a Pointable object, but if no finger or
        * tool with the specified ID is present, an invalid Pointable object is returned.</p>
        *
        * <p>Note that ID values persist across frames, but only until tracking
        * of a particular object is lost. If tracking of a finger or tool is
        * lost and subsequently regained, the new Pointable object representing
        * that finger or tool may have a different ID than that representing
        * the finger or tool in an earlier frame.</p>
        *
        * @param id
        * @return
        * @see Pointable
        *
        */
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

        /**
        * The axis of rotation derived from the change in orientation
        * of this hand, and any associated fingers and tools,
        * between the current frame and the specified frame.
        *
        * <p>The returned direction vector is normalized.</p>
        *
        * <p>If a corresponding Hand object is not found in sinceFrame,
        * or if either this frame or sinceFrame are invalid Frame objects,
        * then this method returns a zero vector.</p>
        *
        * @param sinceFrame The starting frame for computing the relative rotation.
        * @return A normalized direction Vector representing the heuristically
        * determined axis of rotational change of the hand between the current
        * frame and that specified in the sinceFrame parameter.
        * @see Vector3
        *
        */
        Hand.prototype.rotationAxis = function (sinceFrame) {
            if (sinceFrame.hand(this.id)) {
                return new Vector3(this.rotation.zBasis.y - sinceFrame.hand(this.id).rotation.yBasis.z, this.rotation.xBasis.z - sinceFrame.hand(this.id).rotation.zBasis.x, this.rotation.yBasis.x - sinceFrame.hand(this.id).rotation.xBasis.y).normalized();
            } else {
                return new Vector3(0, 0, 0);
            }
        };

        /**
        * The angle of rotation around the rotation axis derived from the
        * overall rotational motion between the current frame and the specified frame.
        *
        * <p>The returned angle is expressed in radians measured clockwise around
        * the rotation axis (using the right-hand rule) between the
        * start and end frames. The value is always between 0 and pi radians (0 and 180 degrees).</p>
        *
        * <p>The Leap derives frame rotation from the relative change in position
        * and orientation of all objects detected in the field of view.</p>
        *
        * <p>If either this frame or sinceFrame is an invalid Frame object,
        * then the angle of rotation is zero.</p>
        *
        * @param sinceFrame The starting frame for computing the relative rotation.
        * @param axis Optional. The axis to measure rotation around.
        * @return A positive value containing the heuristically determined rotational
        * change between the current frame and that specified in the sinceFrame parameter.
        *
        */
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

        /**
        * The transform matrix expressing the rotation derived from
        * the change in orientation of this hand, and any associated
        * fingers and tools, between the current frame and the specified frame.
        *
        * <p>If a corresponding Hand object is not found in sinceFrame,
        * or if either this frame or sinceFrame are invalid Frame objects,
        * then this method returns an identity matrix.</p>
        *
        * @param sinceFrame
        * @return A transformation Matrix representing the heuristically
        * determined rotational change of the hand between the current
        * frame and that specified in the sinceFrame parameter.
        * @see Matrix
        * @see Frame
        *
        */
        Hand.prototype.rotationMatrix = function (sinceFrame) {
            if (sinceFrame.hand(this.id).isValid()) {
                return sinceFrame.hand(this.id).rotation.multiply(new Matrix(new Vector3(this.rotation.xBasis.x, this.rotation.yBasis.x, this.rotation.zBasis.x), new Vector3(this.rotation.xBasis.y, this.rotation.yBasis.y, this.rotation.zBasis.y), new Vector3(this.rotation.xBasis.z, this.rotation.yBasis.z, this.rotation.zBasis.z)));
            } else {
                return Matrix.identity();
            }
        };

        /**
        * The scale factor derived from this hand's motion between
        * the current frame and the specified frame.
        *
        * <p>The scale factor is always positive. A value of 1.0 indicates no
        * scaling took place. Values between 0.0 and 1.0 indicate contraction
        * and values greater than 1.0 indicate expansion.</p>
        *
        * <p>The Leap derives scaling from the relative inward or outward motion
        * of a hand and its associated fingers and tools (independent of
        * translation and rotation).</p>
        *
        * <p>If a corresponding Hand object is not found in sinceFrame,
        * or if either this frame or sinceFrame are invalid Frame objects,
        * then this method returns 1.0.</p>
        *
        * @param sinceFrame The starting frame for computing the relative scaling.
        * @return A positive value representing the heuristically determined
        * scaling change ratio between the current frame and that specified
        * in the sinceFrame parameter.
        *
        */
        Hand.prototype.scaleFactor = function (sinceFrame) {
            var returnValue;
            if (sinceFrame && sinceFrame.hand(this.id) && sinceFrame.hand(this.id).scaleFactorNumber)
                returnValue = Math.exp(this.scaleFactorNumber - sinceFrame.hand(this.id).scaleFactorNumber);
            else
                returnValue = 1;

            return returnValue;
        };

        /**
        * The change of position of this hand between the current frame and the specified frame.
        *
        * @param sinceFrame The starting frame for computing the translation.
        * @return A Vector representing the heuristically determined change
        * in hand position between the current frame and that specified
        * in the sinceFrame parameter.
        * @see Vector3
        *
        */
        Hand.prototype.translation = function (sinceFrame) {
            var returnValue;

            if (sinceFrame.hand(this.id) && sinceFrame.hand(this.id).translationVector)
                returnValue = new Vector3(this.translationVector.x - sinceFrame.hand(this.id).translationVector.x, this.translationVector.y - sinceFrame.hand(this.id).translationVector.y, this.translationVector.z - sinceFrame.hand(this.id).translationVector.z);
            else
                returnValue = new Vector3(0, 0, 0);

            return returnValue;
        };

        /**
        * Returns an invalid Hand object.
        *
        * <p>You can use the instance returned by this in comparisons
        * testing whether a given Hand instance is valid or invalid.
        * (You can also use the <code>Hand.isValid()</code> function.)</p>
        *
        * @return The invalid Hand instance.
        *
        */
        Hand.invalid = function () {
            return new Hand();
        };
        return Hand;
    })();
    exports.Hand = Hand;

    /**
    * The Frame class represents a set of hand and finger tracking
    * data detected in a single frame.
    *
    * <p>The Leap detects hands, fingers and tools within the tracking area,
    * reporting their positions, orientations and motions in frames at
    * the Leap frame rate.</p>
    *
    * <p>Access Frame objects through a listener of a Leap Controller.
    * Add a listener to receive events when a new Frame is available.</p>
    *
    * @author logotype
    *
    */
    var Frame = (function () {
        /**
        * Constructs a Frame object.
        *
        * <p>Frame instances created with this constructor are invalid.
        * Get valid Frame objects by calling the <code>LeapMotion.frame()</code> function.</p>
        *
        */
        function Frame() {
            /**
            * The list of Finger objects detected in this frame, given in arbitrary order.<br/>
            * The list can be empty if no fingers are detected.
            */
            this.fingers = [];
            /**
            * The list of Hand objects detected in this frame, given in arbitrary order.<br/>
            * The list can be empty if no hands are detected.
            */
            this.hands = [];
            /**
            * The Pointable object with the specified ID in this frame.
            *
            * <p>Use the <code>Frame.pointable()</code> to retrieve the Pointable
            * object from this frame using an ID value obtained from a previous frame.
            * This always returns a Pointable object, but if no finger
            * or tool with the specified ID is present, an invalid Pointable
            * object is returned.</p>
            *
            * <p>Note that ID values persist across frames, but only until tracking
            * of a particular object is lost. If tracking of a finger or tool is
            * lost and subsequently regained, the new Pointable object representing
            * that finger or tool may have a different ID than that representing
            * the finger or tool in an earlier frame.</p>
            *
            * @see Pointable
            *
            */
            this.pointables = [];
            /**
            * The gestures recognized or continuing in this frame.
            *
            * <p>Circle and swipe gestures are updated every frame.
            * Tap gestures only appear in the list when they start.</p>
            */
            this._gestures = [];
            /**
            * The list of Tool objects detected in this frame, given in arbitrary order.
            *
            * @see Tool
            */
            this.tools = [];
        }
        /**
        * The Hand object with the specified ID in this frame.
        *
        * <p>Use the <code>Frame.hand()</code> to retrieve the Hand object
        * from this frame using an ID value obtained from a previous frame.
        * This always returns a Hand object, but if no hand
        * with the specified ID is present, an invalid Hand object is returned.</p>
        *
        * <p>Note that ID values persist across frames, but only until tracking
        * of a particular object is lost. If tracking of a hand is lost
        * and subsequently regained, the new Hand object representing
        * that physical hand may have a different ID than that
        * representing the physical hand in an earlier frame.</p>
        *
        * @param id The ID value of a Hand object from a previous frame.
        * @return The Hand object with the matching ID if one exists
        * in this frame; otherwise, an invalid Hand object is returned.
        * @see Hand
        *
        */
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

        /**
        * The Finger object with the specified ID in this frame.
        *
        * <p>Use the <code>Frame.finger()</code> to retrieve the Finger
        * object from this frame using an ID value obtained from a
        * previous frame. This always returns a Finger object,
        * but if no finger with the specified ID is present, an
        * invalid Finger object is returned.</p>
        *
        * <p>Note that ID values persist across frames, but only until
        * tracking of a particular object is lost. If tracking of a
        * finger is lost and subsequently regained, the new Finger
        * object representing that physical finger may have a different
        * ID than that representing the finger in an earlier frame.</p>
        *
        * @param id The ID value of a Finger object from a previous frame.
        * @return The Finger object with the matching ID if one exists
        * in this frame; otherwise, an invalid Finger object is returned.
        * @see Finger
        *
        */
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

        /**
        * The Tool object with the specified ID in this frame.
        *
        * <p>Use the <code>Frame.tool()</code> to retrieve the Tool
        * object from this frame using an ID value obtained from
        * a previous frame. This always returns a Tool
        * object, but if no tool with the specified ID is present,
        * an invalid Tool object is returned.</p>
        *
        * <p>Note that ID values persist across frames, but only until
        * tracking of a particular object is lost. If tracking of a
        * tool is lost and subsequently regained, the new Tool
        * object representing that tool may have a different ID
        * than that representing the tool in an earlier frame.</p>
        *
        * @param id The ID value of a Tool object from a previous frame.
        * @return The Tool object with the matching ID if one exists in
        * this frame; otherwise, an invalid Tool object is returned.
        * @see Tool
        *
        */
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

        /**
        * The Pointable object with the specified ID in this frame.
        *
        * <p>Use the <code>Frame.pointable()</code> to retrieve the Pointable
        * object from this frame using an ID value obtained from a previous frame.
        * This always returns a Pointable object, but if no finger
        * or tool with the specified ID is present, an invalid
        * Pointable object is returned.</p>
        *
        * <p>Note that ID values persist across frames, but only until tracking
        * of a particular object is lost. If tracking of a finger or tool is
        * lost and subsequently regained, the new Pointable object representing
        * that finger or tool may have a different ID than that representing
        * the finger or tool in an earlier frame.</p>
        *
        * @param id The ID value of a Pointable object from a previous frame.
        * @return The Pointable object with the matching ID if one exists
        * in this frame; otherwise, an invalid Pointable object is returned.
        *
        */
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

        /**
        * The Gesture object with the specified ID in this frame.
        *
        * <p>Use the <code>Frame.gesture()</code> to return a Gesture object in this frame
        * using an ID obtained in an earlier frame. The always returns a
        * Gesture object, but if there was no update for the gesture in this frame,
        * then an invalid Gesture object is returned.</p>
        *
        * <p>All Gesture objects representing the same recognized movement share the same ID.</p>
        *
        * @param id The ID of an Gesture object from a previous frame.
        * @return The Gesture object in the frame with the specified ID if one
        * exists; Otherwise, an Invalid Gesture object.
        *
        */
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

        /**
        * Returns a Gesture vector containing all gestures that have occurred
        * since the specified frame.
        *
        * <p>If no frame is specifed, the gestures recognized or continuing in
        * this frame will be returned.</p>
        *
        * @param sinceFrame An earlier Frame object. The starting frame must
        * still be in the frame history cache, which has a default length of 60 frames.
        * @return The list of gestures.
        *
        */
        Frame.prototype.gestures = function (sinceFrame) {
            if (typeof sinceFrame === "undefined") { sinceFrame = null; }
            if (!sinceFrame) {
                // The gestures recognized or continuing in this frame.
                return this._gestures;
            } else {
                // Returns a Gesture vector containing all gestures that have occurred since the specified frame.
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

        /**
        * The axis of rotation derived from the overall rotational
        * motion between the current frame and the specified frame.
        *
        * <p>The returned direction vector is normalized.</p>
        *
        * <p>The Leap derives frame rotation from the relative change
        * in position and orientation of all objects detected in
        * the field of view.</p>
        *
        * <p>If either this frame or sinceFrame is an invalid Frame
        * object, or if no rotation is detected between the
        * two frames, a zero vector is returned.</p>
        *
        * @param sinceFrame The starting frame for computing the relative rotation.
        * @return A normalized direction Vector representing the axis of the
        * heuristically determined rotational change between the current
        * frame and that specified in the sinceFrame parameter.
        *
        */
        Frame.prototype.rotationAxis = function (sinceFrame) {
            if (sinceFrame && sinceFrame.rotation) {
                var vector = new Vector3(this.rotation.zBasis.y - sinceFrame.rotation.yBasis.z, this.rotation.xBasis.z - sinceFrame.rotation.zBasis.x, this.rotation.yBasis.x - sinceFrame.rotation.xBasis.y);
                return vector.normalized();
            } else {
                return new Vector3(0, 0, 0);
            }
        };

        /**
        * The angle of rotation around the rotation axis derived from the
        * overall rotational motion between the current frame and the specified frame.
        *
        * <p>The returned angle is expressed in radians measured clockwise around
        * the rotation axis (using the right-hand rule) between the
        * start and end frames. The value is always between 0 and pi radians (0 and 180 degrees).</p>
        *
        * <p>The Leap derives frame rotation from the relative change in position
        * and orientation of all objects detected in the field of view.</p>
        *
        * <p>If either this frame or sinceFrame is an invalid Frame object,
        * then the angle of rotation is zero.</p>
        *
        * @param sinceFrame The starting frame for computing the relative rotation.
        * @param axis Optional. The axis to measure rotation around.
        * @return A positive value containing the heuristically determined rotational
        * change between the current frame and that specified in the sinceFrame parameter.
        *
        */
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

        /**
        * The transform matrix expressing the rotation derived from
        * the change in orientation of this hand, and any associated
        * fingers and tools, between the current frame and the specified frame.
        *
        * <p>If a corresponding Hand object is not found in sinceFrame,
        * or if either this frame or sinceFrame are invalid Frame objects,
        * then this method returns an identity matrix.</p>
        *
        * @param sinceFrame
        * @return
        *
        */
        Frame.prototype.rotationMatrix = function (sinceFrame) {
            if (sinceFrame && sinceFrame.rotation) {
                return sinceFrame.rotation.multiply(new Matrix(new Vector3(this.rotation.xBasis.x, this.rotation.yBasis.x, this.rotation.zBasis.x), new Vector3(this.rotation.xBasis.y, this.rotation.yBasis.y, this.rotation.zBasis.y), new Vector3(this.rotation.xBasis.z, this.rotation.yBasis.z, this.rotation.zBasis.z)));
            } else {
                return Matrix.identity();
            }
        };

        /**
        * The scale factor derived from the overall motion between the
        * current frame and the specified frame.
        *
        * <p>The scale factor is always positive. A value of 1.0 indicates no
        * scaling took place. Values between 0.0 and 1.0 indicate contraction
        * and values greater than 1.0 indicate expansion.</p>
        *
        * <p>The Leap derives scaling from the relative inward or outward
        * motion of all objects detected in the field of view (independent
        * of translation and rotation).</p>
        *
        * <p>If either this frame or sinceFrame is an invalid Frame object,
        * then this method returns 1.0.</p>
        *
        * @param sinceFrame The starting frame for computing the relative scaling.
        * @return A positive value representing the heuristically determined
        * scaling change ratio between the current frame and that specified
        * in the sinceFrame parameter.
        *
        */
        Frame.prototype.scaleFactor = function (sinceFrame) {
            var returnValue;
            if (sinceFrame && sinceFrame.scaleFactorNumber)
                returnValue = Math.exp(this.scaleFactorNumber - sinceFrame.scaleFactorNumber);
            else
                returnValue = 1;

            return returnValue;
        };

        /**
        * The change of position derived from the overall linear motion
        * between the current frame and the specified frame.
        *
        * <p>The returned translation vector provides the magnitude and
        * direction of the movement in millimeters.</p>
        *
        * <p>The Leap derives frame translation from the linear motion
        * of all objects detected in the field of view.</p>
        *
        * <p>If either this frame or sinceFrame is an invalid Frame object,
        * then this method returns a zero vector.</p>
        *
        * @param sinceFrame The starting frame for computing the translation.
        * @return A Vector representing the heuristically determined change
        * in hand position between the current frame and that specified
        * in the sinceFrame parameter.
        *
        */
        Frame.prototype.translation = function (sinceFrame) {
            var returnValue;

            if (sinceFrame.translationVector)
                returnValue = new Vector3(this.translationVector.x - sinceFrame.translationVector.x, this.translationVector.y - sinceFrame.translationVector.y, this.translationVector.z - sinceFrame.translationVector.z);
            else
                returnValue = new Vector3(0, 0, 0);

            return returnValue;
        };

        /**
        * Compare Frame object equality.
        *
        * <p>Two Frame objects are equal if and only if both Frame objects
        * represent the exact same frame of tracking data and both
        * Frame objects are valid.</p>
        *
        * @param other The Frame to compare with.
        * @return True; if equal. False otherwise.
        *
        */
        Frame.prototype.isEqualTo = function (other) {
            var returnValue = true;

            if (this.id != other.id || !this.isValid() || other.isValid())
                returnValue = false;

            return returnValue;
        };

        /**
        * Reports whether this Frame instance is valid.
        *
        * <p>A valid Frame is one generated by the LeapMotion object that contains
        * tracking data for all detected entities. An invalid Frame contains
        * no actual tracking data, but you can call its functions without risk
        * of a null pointer exception. The invalid Frame mechanism makes it
        * more convenient to track individual data across the frame history.</p>
        *
        * <p>For example, you can invoke: <code>var finger:Finger = leap.frame(n).finger(fingerID);</code>
        * for an arbitrary Frame history value, "n", without first checking whether
        * frame(n) returned a null object.<br/>
        * (You should still check that the returned Finger instance is valid.)</p>
        *
        * @return True, if this is a valid Frame object; false otherwise.
        *
        */
        Frame.prototype.isValid = function () {
            if (!this.id)
                return false;

            return true;
        };

        /**
        * Returns an invalid Frame object.
        *
        * <p>You can use the instance returned by this in comparisons
        * testing whether a given Frame instance is valid or invalid.
        * (You can also use the <code>Frame.isValid()</code> function.)</p>
        *
        * @return The invalid Frame instance.
        *
        */
        Frame.invalid = function () {
            return new Frame();
        };
        return Frame;
    })();
    exports.Frame = Frame;

    /**
    * The Matrix struct represents a transformation matrix.
    *
    * <p>To use this struct to transform a Vector, construct a matrix containing the
    * desired transformation and then use the <code>Matrix.transformPoint()</code> or
    * <code>Matrix.transformDirection()</code> functions to apply the transform.</p>
    *
    * <p>Transforms can be combined by multiplying two or more transform matrices
    * using the <code>multiply()</code> function.</p>
    *
    *
    * @author logotype
    *
    */
    var Matrix = (function () {
        /**
        * Constructs a transformation matrix from the specified basis vectors.
        * @param x A Vector specifying rotation and scale factors for the x-axis.
        * @param y A Vector specifying rotation and scale factors for the y-axis.
        * @param z A Vector specifying rotation and scale factors for the z-axis.
        * @param _origin A Vector specifying translation factors on all three axes.
        *
        */
        function Matrix(x, y, z, _origin) {
            if (typeof _origin === "undefined") { _origin = null; }
            /**
            * The translation factors for all three axes.
            */
            this.origin = new Vector3(0, 0, 0);
            /**
            * The rotation and scale factors for the x-axis.
            */
            this.xBasis = new Vector3(0, 0, 0);
            /**
            * The rotation and scale factors for the y-axis.
            */
            this.yBasis = new Vector3(0, 0, 0);
            /**
            * The rotation and scale factors for the z-axis.
            */
            this.zBasis = new Vector3(0, 0, 0);
            this.xBasis = x;
            this.yBasis = y;
            this.zBasis = z;

            if (_origin)
                this.origin = _origin;
        }
        /**
        * Sets this transformation matrix to represent a rotation around the specified vector.
        * This erases any previous rotation and scale transforms applied to this matrix,
        * but does not affect translation.
        *
        * @param _axis A Vector specifying the axis of rotation.
        * @param angleRadians The amount of rotation in radians.
        *
        */
        Matrix.prototype.setRotation = function (_axis, angleRadians) {
            var axis = _axis.normalized();
            var s = Math.sin(angleRadians);
            var c = Math.cos(angleRadians);
            var C = (1 - c);

            this.xBasis = new Vector3(axis.x * axis.x * C + c, axis.x * axis.y * C - axis.z * s, axis.x * axis.z * C + axis.y * s);
            this.yBasis = new Vector3(axis.y * axis.x * C + axis.z * s, axis.y * axis.y * C + c, axis.y * axis.z * C - axis.x * s);
            this.zBasis = new Vector3(axis.z * axis.x * C - axis.y * s, axis.z * axis.y * C + axis.x * s, axis.z * axis.z * C + c);
        };

        /**
        * Transforms a vector with this matrix by transforming its rotation, scale, and translation.
        * Translation is applied after rotation and scale.
        *
        * @param inVector The Vector to transform.
        * @return A new Vector representing the transformed original.
        *
        */
        Matrix.prototype.transformPoint = function (inVector) {
            return new Vector3(this.xBasis.multiply(inVector.x).x, this.yBasis.multiply(inVector.y).y, this.zBasis.multiply(inVector.z).z + this.origin.z);
        };

        /**
        * Transforms a vector with this matrix by transforming its rotation and scale only.
        * @param inVector The Vector to transform.
        * @return A new Vector representing the transformed original.
        *
        */
        Matrix.prototype.transformDirection = function (inVector) {
            var x = this.xBasis.multiply(inVector.x);
            var y = this.yBasis.multiply(inVector.y);
            var z = this.zBasis.multiply(inVector.z);
            return x.plus(y).plus(z);
        };

        /**
        * Performs a matrix inverse if the matrix consists entirely of rigid transformations (translations and rotations).
        * @return The rigid inverse of the matrix.
        *
        */
        Matrix.prototype.rigidInverse = function () {
            var rotInverse = new Matrix(new Vector3(this.xBasis.x, this.yBasis.x, this.zBasis.x), new Vector3(this.xBasis.y, this.yBasis.y, this.zBasis.y), new Vector3(this.xBasis.z, this.yBasis.z, this.zBasis.z));
            if (this.origin)
                rotInverse.origin = rotInverse.transformDirection(this.origin.opposite());
            return rotInverse;
        };

        /**
        * Multiply transform matrices.
        * @param other A Matrix to multiply on the right hand side.
        * @return A new Matrix representing the transformation equivalent to applying the other transformation followed by this transformation.
        *
        */
        Matrix.prototype.multiply = function (other) {
            var x = this.transformDirection(other.xBasis);
            var y = this.transformDirection(other.yBasis);
            var z = this.transformDirection(other.zBasis);
            var o = this.origin;

            if (this.origin && other.origin)
                o = this.transformPoint(other.origin);

            return new Matrix(x, y, z, o);
        };

        /**
        * Multiply transform matrices and assign the product.
        * @param other A Matrix to multiply on the right hand side.
        * @return This Matrix representing the transformation equivalent to applying the other transformation followed by this transformation.
        *
        */
        Matrix.prototype.multiplyAssign = function (other) {
            this.xBasis = this.transformDirection(other.xBasis);
            this.yBasis = this.transformDirection(other.yBasis);
            this.zBasis = this.transformDirection(other.zBasis);
            this.origin = this.transformPoint(other.origin);
            return this;
        };

        /**
        * Compare Matrix equality/inequality component-wise.
        * @param other The Matrix to compare with.
        * @return True; if equal, False otherwise.
        *
        */
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

        /**
        * Returns the identity matrix specifying no translation, rotation, and scale.
        * @return The identity matrix.
        *
        */
        Matrix.identity = function () {
            var xBasis = new Vector3(1, 0, 0);
            var yBasis = new Vector3(0, 1, 0);
            var zBasis = new Vector3(0, 0, 1);

            return new Matrix(xBasis, yBasis, zBasis);
        };

        /**
        * Write the matrix to a string in a human readable format.
        * @return
        *
        */
        Matrix.prototype.toString = function () {
            return "[Matrix xBasis:" + this.xBasis.toString() + " yBasis:" + this.yBasis.toString() + " zBasis:" + this.zBasis.toString() + " origin:" + this.origin.toString() + "]";
        };
        return Matrix;
    })();
    exports.Matrix = Matrix;

    /**
    * The CircleGesture class represents a circular finger movement.
    *
    * <p>A circle movement is recognized when the tip of a finger draws
    * a circle within the Leap field of view.</p>
    *
    * <p><strong>Important: To use circle gestures in your application, you must
    * enable recognition of the circle gesture.</strong><br/>
    * You can enable recognition with:</p>
    *
    * <code>leap.controller.enableGesture(Gesture.TYPE_CIRCLE);</code>
    *
    * <p>Circle gestures are continuous. The CircleGesture objects for
    * the gesture have three possible states:</p>
    *
    * <p><code>Gesture.STATE_START</code> – The circle gesture has just started.
    * The movement has progressed far enough for the recognizer to classify it as a circle.</p>
    *
    * <p><code>Gesture.STATE_UPDATE</code> – The circle gesture is continuing.</p>
    *
    * <p><code>Gesture.STATE_STOP</code> – The circle gesture is finished.</p>
    *
    * <p>You can set the minimum radius and minimum arc length required for a
    * movement to be recognized as a circle using the config attribute of a
    * connected Controller object. Use the following keys to configure circle recognition:</p>
    *
    * <table class="innertable">
    *   <tr>
    *    <th>Key string</th>
    *    <th>Value type</th>
    *    <th>Default value</th>
    *    <th>Units</th>
    *  </tr>
    *   <tr>
    *    <td>Gesture.Circle.MinRadius</td>
    *    <td>float</td>
    *    <td>5.0</td>
    *    <td>mm</td>
    *  </tr>
    *   <tr>
    *    <td>Gesture.Circle.MinArc</td>
    *    <td>float</td>
    *    <td>1.5&#42;pi</td>
    *    <td>radians</td>
    *  </tr>
    * </table>
    *
    * <p>The following example demonstrates how to set the circle configuration parameters:</p>
    *
    * <listing>if(controller.config().setFloat(&quot;Gesture.Circle.MinRadius&quot;, 10.0) &amp;&amp;
    *       controller.config().setFloat(&quot;Gesture.Circle.MinArc&quot;, .5))
    *        controller.config().save();</listing>
    *
    * @author logotype
    * @see Gesture
    *
    */
    var CircleGesture = (function (_super) {
        __extends(CircleGesture, _super);
        /**
        * Constructs a new CircleGesture object.
        *
        * <p>An uninitialized CircleGesture object is considered invalid.
        * Get valid instances of the CircleGesture class from a Frame object.</p>
        *
        */
        function CircleGesture() {
            _super.call(this);
            this.pointable = Pointable.invalid();
        }
        CircleGesture.classType = 6 /* TYPE_CIRCLE */;
        return CircleGesture;
    })(Gesture);
    exports.CircleGesture = CircleGesture;

    /**
    * The KeyTapGesture class represents a tapping gesture by a finger or tool.
    *
    * <p>A key tap gesture is recognized when the tip of a finger rotates down
    * toward the palm and then springs back to approximately the original
    * postion, as if tapping. The tapping finger must pause briefly before
    * beginning the tap.</p>
    *
    * <p><strong>Important: To use key tap gestures in your application, you must enable
    * recognition of the key tap gesture.</strong><br/>You can enable recognition with:</p>
    *
    * <code>leap.controller.enableGesture(Gesture.TYPE_KEY_TAP);</code>
    *
    * <p>Key tap gestures are discrete. The KeyTapGesture object representing a
    * tap always has the state, <code>STATE_STOP</code>. Only one KeyTapGesture object
    * is created for each key tap gesture recognized.</p>
    *
    * <p>You can set the minimum finger movement and velocity required for a movement
    * to be recognized as a key tap as well as adjust the detection window for evaluating
    * the movement using the config attribute of a connected Controller object.
    * Use the following configuration keys to configure key tap recognition:</p>
    *
    * <table class="innertable">
    *   <tr>
    *    <th>Key string</th>
    *    <th>Value type</th>
    *    <th>Default value</th>
    *    <th>Units</th>
    *  </tr>
    *   <tr>
    *    <td>Gesture.KeyTap.MinDownVelocity</td>
    *    <td>float</td>
    *    <td>50</td>
    *    <td>mm/s</td>
    *  </tr>
    *   <tr>
    *    <td>Gesture.KeyTap.HistorySeconds</td>
    *    <td>float</td>
    *    <td>0.1</td>
    *    <td>s</td>
    *  </tr>
    *   <tr>
    *    <td>Gesture.KeyTap.MinDistance</td>
    *    <td>float</td>
    *    <td>5.0</td>
    *    <td>mm</td>
    *  </tr>
    * </table>
    *
    * <p>The following example demonstrates how to set the screen tap configuration parameters:</p>
    *
    * <code>if(controller.config().setFloat(&quot;Gesture.KeyTap.MinDownVelocity&quot;, 40.0) &amp;&amp;
    *       controller.config().setFloat(&quot;Gesture.KeyTap.HistorySeconds&quot;, .2) &amp;&amp;
    *       controller.config().setFloat(&quot;Gesture.KeyTap.MinDistance&quot;, 8.0))
    *        controller.config().save();</code>
    *
    * @author logotype
    *
    */
    var KeyTapGesture = (function (_super) {
        __extends(KeyTapGesture, _super);
        /**
        * Constructs a new KeyTapGesture object.
        *
        * <p>An uninitialized KeyTapGesture object is considered invalid.
        * Get valid instances of the KeyTapGesture class from a Frame object.</p>
        *
        */
        function KeyTapGesture() {
            _super.call(this);
            /**
            * The progess value is always 1.0 for a key tap gesture.
            */
            this.progress = 1;
        }
        KeyTapGesture.classType = 8 /* TYPE_KEY_TAP */;
        return KeyTapGesture;
    })(Gesture);
    exports.KeyTapGesture = KeyTapGesture;

    /**
    * The ScreenTapGesture class represents a tapping gesture by a finger or tool.
    *
    * <p>A screen tap gesture is recognized when the tip of a finger pokes forward
    * and then springs back to approximately the original postion, as if tapping
    * a vertical screen. The tapping finger must pause briefly before beginning the tap.</p>
    *
    * <strong>Important: To use screen tap gestures in your application, you must enable
    * recognition of the screen tap gesture.</strong><br/> You can enable recognition with:
    *
    * <code>leap.controller.enableGesture(Gesture.TYPE_SCREEN_TAP);</code>
    *
    * <p>ScreenTap gestures are discrete. The ScreenTapGesture object representing a
    * tap always has the state, <code>STATE_STOP</code>. Only one ScreenTapGesture object is
    * created for each screen tap gesture recognized.</p>
    *
    * <p>You can set the minimum finger movement and velocity required for a movement
    * to be recognized as a screen tap as well as adjust the detection window for
    * evaluating the movement using the config attribute of a connected Controller object.
    * Use the following keys to configure screen tap recognition:</p>
    *
    * <table class="innertable">
    *   <tr>
    *    <th>Key string</th>
    *    <th>Value type</th>
    *    <th>Default value</th>
    *    <th>Units</th>
    *  </tr>
    *   <tr>
    *    <td>Gesture.ScreenTap.MinForwardVelocity</td>
    *    <td>float</td>
    *    <td>50</td>
    *    <td>mm/s</td>
    *  </tr>
    *   <tr>
    *    <td>Gesture.ScreenTap.HistorySeconds</td>
    *    <td>float</td>
    *    <td>0.1</td>
    *    <td>s</td>
    *  </tr>
    *   <tr>
    *    <td>Gesture.ScreenTap.MinDistance</td>
    *    <td>float</td>
    *    <td>3.0</td>
    *    <td>mm</td>
    *  </tr>
    * </table>
    *
    * <p>The following example demonstrates how to set the screen tap configuration parameters:</p>
    *
    * <code> if(controller.config().setFloat(&quot;Gesture.ScreenTap.MinForwardVelocity&quot;, 30.0) &amp;&amp;
    *       controller.config().setFloat(&quot;Gesture.ScreenTap.HistorySeconds&quot;, .5) &amp;&amp;
    *       controller.config().setFloat(&quot;Gesture.ScreenTap.MinDistance&quot;, 1.0))
    *        controller.config().save();</code>
    *
    * @author logotype
    *
    */
    var ScreenTapGesture = (function (_super) {
        __extends(ScreenTapGesture, _super);
        /**
        * Constructs a new ScreenTapGesture object.
        *
        * <p>An uninitialized ScreenTapGesture object is considered invalid.
        * Get valid instances of the ScreenTapGesture class from a Frame object.</p>
        *
        */
        function ScreenTapGesture() {
            _super.call(this);
            /**
            * The progess value is always 1.0 for a screen tap gesture.
            */
            this.progress = 1;
        }
        ScreenTapGesture.classType = 7 /* TYPE_SCREEN_TAP */;
        return ScreenTapGesture;
    })(Gesture);
    exports.ScreenTapGesture = ScreenTapGesture;

    /**
    * The SwipeGesture class represents a swiping motion of a finger or tool.
    *
    * <p><strong>Important: To use swipe gestures in your application, you must enable
    * recognition of the swipe gesture.</strong><br/>You can enable recognition with:</p>
    *
    * <p><code>leap.controller.enableGesture(Gesture.TYPE_SWIPE);</code></p>
    *
    * <p>Swipe gestures are continuous.</p>
    *
    * <p>You can set the minimum length and velocity required for a movement to be
    * recognized as a swipe using the config attribute of a connected Controller object.
    * Use the following keys to configure swipe recognition:</p>
    *
    * <table class="innertable">
    *   <tr>
    *    <th>Key string</th>
    *    <th>Value type</th>
    *    <th>Default value</th>
    *    <th>Units</th>
    *  </tr>
    *   <tr>
    *    <td>Gesture.Swipe.MinLength</td>
    *    <td>float</td>
    *    <td>150</td>
    *    <td>mm</td>
    *  </tr>
    *   <tr>
    *    <td>Gesture.Swipe.MinVelocity</td>
    *    <td>float</td>
    *    <td>1000</td>
    *    <td>mm/s</td>
    *  </tr>
    * </table>
    *
    * <p>The following example demonstrates how to set the swipe configuration parameters:</p>
    *
    * <code>if(controller.config().setFloat(&quot;Gesture.Swipe.MinLength&quot;, 200.0) &amp;&amp;
    *       controller.config().setFloat(&quot;Gesture.Swipe.MinVelocity&quot;, 750))
    *        controller.config().save();</code>
    *
    * @author logotype
    *
    */
    var SwipeGesture = (function (_super) {
        __extends(SwipeGesture, _super);
        /**
        * Constructs a SwipeGesture object from an instance of the Gesture class.
        *
        */
        function SwipeGesture() {
            _super.call(this);
        }
        SwipeGesture.classType = 5 /* TYPE_SWIPE */;
        return SwipeGesture;
    })(Gesture);
    exports.SwipeGesture = SwipeGesture;

    /**
    * The Vector struct represents a three-component mathematical vector
    * or point such as a direction or position in three-dimensional space.
    *
    * <p>The Leap software employs a right-handed Cartesian coordinate system.
    * Values given are in units of real-world millimeters. The origin is
    * centered at the center of the Leap Motion Controller. The x- and z-axes lie in
    * the horizontal plane, with the x-axis running parallel to the long edge
    * of the device. The y-axis is vertical, with positive values increasing
    * upwards (in contrast to the downward orientation of most computer
    * graphics coordinate systems). The z-axis has positive values increasing
    * away from the computer screen.</p>
    *
    * @author logotype
    *
    */
    var Vector3 = (function () {
        /**
        * Creates a new Vector with the specified component values.
        * @constructor
        * @param x The horizontal component.
        * @param y The vertical component.
        * @param z The depth component.
        *
        */
        function Vector3(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        /**
        * A copy of this vector pointing in the opposite direction.
        * @return A Vector3 object with all components negated.
        *
        */
        Vector3.prototype.opposite = function () {
            return new Vector3(-this.x, -this.y, -this.z);
        };

        /**
        * Add vectors component-wise.
        * @param other
        * @return
        *
        */
        Vector3.prototype.plus = function (other) {
            return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
        };

        /**
        * Add vectors component-wise and assign the value.
        * @param other
        * @return This Vector3.
        *
        */
        Vector3.prototype.plusAssign = function (other) {
            this.x += other.x;
            this.y += other.y;
            this.z += other.z;
            return this;
        };

        /**
        * A copy of this vector pointing in the opposite direction.
        * @param other
        * @return
        *
        */
        Vector3.prototype.minus = function (other) {
            return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
        };

        /**
        * A copy of this vector pointing in the opposite direction and assign the value.
        * @param other
        * @return This Vector3.
        *
        */
        Vector3.prototype.minusAssign = function (other) {
            this.x -= other.x;
            this.y -= other.y;
            this.z -= other.z;
            return this;
        };

        /**
        * Multiply vector by a scalar.
        * @param scalar
        * @return
        *
        */
        Vector3.prototype.multiply = function (scalar) {
            return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
        };

        /**
        * Multiply vector by a scalar and assign the quotient.
        * @param scalar
        * @return This Vector3.
        *
        */
        Vector3.prototype.multiplyAssign = function (scalar) {
            this.x *= scalar;
            this.y *= scalar;
            this.z *= scalar;
            return this;
        };

        /**
        * Divide vector by a scalar.
        * @param scalar
        * @return
        *
        */
        Vector3.prototype.divide = function (scalar) {
            return new Vector3(this.x / scalar, this.y / scalar, this.z / scalar);
        };

        /**
        * Divide vector by a scalar and assign the value.
        * @param scalar
        * @return This Vector3.
        *
        */
        Vector3.prototype.divideAssign = function (scalar) {
            this.x /= scalar;
            this.y /= scalar;
            this.z /= scalar;
            return this;
        };

        /**
        * Compare Vector equality/inequality component-wise.
        * @param other The Vector3 to compare with.
        * @return True; if equal, False otherwise.
        *
        */
        Vector3.prototype.isEqualTo = function (other) {
            return (this.x != other.x || this.y != other.y || this.z != other.z);
        };

        /**
        * The angle between this vector and the specified vector in radians.
        *
        * <p>The angle is measured in the plane formed by the two vectors.
        * The angle returned is always the smaller of the two conjugate angles.
        * Thus <code>A.angleTo(B) === B.angleTo(A)</code> and is always a positive value less
        * than or equal to pi radians (180 degrees).</p>
        *
        * <p>If either vector has zero length, then this returns zero.</p>
        *
        * @param other A Vector object.
        * @return The angle between this vector and the specified vector in radians.
        *
        */
        Vector3.prototype.angleTo = function (other) {
            var denom = this.magnitudeSquared() * other.magnitudeSquared();
            if (denom <= 0)
                return 0;

            return Math.acos(this.dot(other) / Math.sqrt(denom));
        };

        /**
        * The cross product of this vector and the specified vector.
        *
        * The cross product is a vector orthogonal to both original vectors.
        * It has a magnitude equal to the area of a parallelogram having the
        * two vectors as sides. The direction of the returned vector is
        * determined by the right-hand rule. Thus <code>A.cross(B) === -B.cross(A)</code>.
        *
        * @param other A Vector object.
        * @return The cross product of this vector and the specified vector.
        *
        */
        Vector3.prototype.cross = function (other) {
            return new Vector3((this.y * other.z) - (this.z * other.y), (this.z * other.x) - (this.x * other.z), (this.x * other.y) - (this.y * other.x));
        };

        /**
        * The distance between the point represented by this Vector
        * object and a point represented by the specified Vector object.
        *
        * @param other A Vector object.
        * @return The distance from this point to the specified point.
        *
        */
        Vector3.prototype.distanceTo = function (other) {
            return Math.sqrt((this.x - other.x) * (this.x - other.x) + (this.y - other.y) * (this.y - other.y) + (this.z - other.z) * (this.z - other.z));
        };

        /**
        * The dot product of this vector with another vector.
        * The dot product is the magnitude of the projection of this vector
        * onto the specified vector.
        *
        * @param other A Vector object.
        * @return The dot product of this vector and the specified vector.
        *
        */
        Vector3.prototype.dot = function (other) {
            return (this.x * other.x) + (this.y * other.y) + (this.z * other.z);
        };

        /**
        * Returns true if all of the vector's components are finite.
        * @return If any component is NaN or infinite, then this returns false.
        *
        */
        Vector3.prototype.isValid = function () {
            return (this.x <= Number.MAX_VALUE && this.x >= -Number.MAX_VALUE) && (this.y <= Number.MAX_VALUE && this.y >= -Number.MAX_VALUE) && (this.z <= Number.MAX_VALUE && this.z >= -Number.MAX_VALUE);
        };

        /**
        * Returns an invalid Vector3 object.
        *
        * You can use the instance returned by this in
        * comparisons testing whether a given Vector3 instance
        * is valid or invalid.
        * (You can also use the Vector3.isValid property.)
        *
        * @return The invalid Vector3 instance.
        *
        */
        Vector3.invalid = function () {
            return new Vector3(NaN, NaN, NaN);
        };

        /**
        * The magnitude, or length, of this vector.
        * The magnitude is the L2 norm, or Euclidean distance between the
        * origin and the point represented by the (x, y, z) components
        * of this Vector object.
        *
        * @return The length of this vector.
        *
        */
        Vector3.prototype.magnitude = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        };

        /**
        * The square of the magnitude, or length, of this vector.
        * @return The square of the length of this vector.
        *
        */
        Vector3.prototype.magnitudeSquared = function () {
            return this.x * this.x + this.y * this.y + this.z * this.z;
        };

        /**
        * A normalized copy of this vector.
        * A normalized vector has the same direction as the original
        * vector, but with a length of one.
        * @return A Vector object with a length of one, pointing in the same direction as this Vector object.
        *
        */
        Vector3.prototype.normalized = function () {
            var denom = this.magnitudeSquared();
            if (denom <= 0)
                return new Vector3(0, 0, 0);

            denom = 1 / Math.sqrt(denom);
            return new Vector3(this.x * denom, this.y * denom, this.z * denom);
        };

        Object.defineProperty(Vector3.prototype, "pitch", {
            /**
            * The pitch angle in radians.
            * Pitch is the angle between the negative z-axis and the projection
            * of the vector onto the y-z plane. In other words, pitch represents
            * rotation around the x-axis. If the vector points upward, the
            * returned angle is between 0 and pi radians (180 degrees); if it
            * points downward, the angle is between 0 and -pi radians.
            *
            * @return The angle of this vector above or below the horizon (x-z plane).
            *
            */
            get: function () {
                return Math.atan2(this.y, -this.z);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vector3.prototype, "yaw", {
            /**
            * The yaw angle in radians.
            * Yaw is the angle between the negative z-axis and the projection
            * of the vector onto the x-z plane. In other words, yaw represents
            * rotation around the y-axis. If the vector points to the right of
            * the negative z-axis, then the returned angle is between 0 and pi
            * radians (180 degrees); if it points to the left, the angle is
            * between 0 and -pi radians.
            *
            * @return The angle of this vector to the right or left of the negative z-axis.
            *
            */
            get: function () {
                return Math.atan2(this.x, -this.z);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vector3.prototype, "roll", {
            /**
            * The roll angle in radians.
            * Roll is the angle between the y-axis and the projection of the vector
            * onto the x-y plane. In other words, roll represents rotation around
            * the z-axis. If the vector points to the left of the y-axis, then the
            * returned angle is between 0 and pi radians (180 degrees); if it
            * points to the right, the angle is between 0 and -pi radians.
            *
            * Use this to roll angle of the plane to which this vector
            * is a normal. For example, if this vector represents the normal to
            * the palm, then this returns the tilt or roll of the palm
            * plane compared to the horizontal (x-z) plane.
            *
            * @return The angle of this vector to the right or left of the y-axis.
            *
            */
            get: function () {
                return Math.atan2(this.x, -this.y);
            },
            enumerable: true,
            configurable: true
        });

        /**
        * The zero vector: (0, 0, 0)
        * @return
        *
        */
        Vector3.zero = function () {
            return new Vector3(0, 0, 0);
        };

        /**
        * The x-axis unit vector: (1, 0, 0)
        * @return
        *
        */
        Vector3.xAxis = function () {
            return new Vector3(1, 0, 0);
        };

        /**
        * The y-axis unit vector: (0, 1, 0)
        * @return
        *
        */
        Vector3.yAxis = function () {
            return new Vector3(0, 1, 0);
        };

        /**
        * The z-axis unit vector: (0, 0, 1)
        * @return
        *
        */
        Vector3.zAxis = function () {
            return new Vector3(0, 0, 1);
        };

        /**
        * The unit vector pointing left along the negative x-axis: (-1, 0, 0)
        * @return
        *
        */
        Vector3.left = function () {
            return new Vector3(-1, 0, 0);
        };

        /**
        * The unit vector pointing right along the positive x-axis: (1, 0, 0)
        * @return
        *
        */
        Vector3.right = function () {
            return this.xAxis();
        };

        /**
        * The unit vector pointing down along the negative y-axis: (0, -1, 0)
        * @return
        *
        */
        Vector3.down = function () {
            return new Vector3(0, -1, 0);
        };

        /**
        * The unit vector pointing up along the positive x-axis: (0, 1, 0)
        * @return
        *
        */
        Vector3.up = function () {
            return this.yAxis();
        };

        /**
        * The unit vector pointing forward along the negative z-axis: (0, 0, -1)
        * @return
        *
        */
        Vector3.forward = function () {
            return new Vector3(0, 0, -1);
        };

        /**
        * The unit vector pointing backward along the positive z-axis: (0, 0, 1)
        * @return
        *
        */
        Vector3.backward = function () {
            return this.zAxis();
        };

        /**
        * Returns a string containing this vector in a human readable format: (x, y, z).
        * @return
        *
        */
        Vector3.prototype.toString = function () {
            return "[Vector3 x:" + this.x + " y:" + this.y + " z:" + this.z + "]";
        };
        return Vector3;
    })();
    exports.Vector3 = Vector3;
});
//# sourceMappingURL=leapmotionts-1.0.9+8391.js.map
