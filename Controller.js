var Leap;
(function (Leap) {
    var Controller = (function () {
        function Controller(host) {
            if (typeof host === "undefined") { host = null; }
            var _this = this;
            this.frameHistory = [];
            if(!host) {
                this.connection = new WebSocket("ws://localhost:6437");
            } else {
                this.connection = new WebSocket("ws://" + host + ":6437");
            }
            this.connection.onopen = this.onWebsocketOpenHandler;
            this.connection.onclose = this.onWebsocketCloseHandler;
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
                if((typeof json["timestamp"] === "undefined")) {
                    return;
                }
                currentFrame = new Leap.Frame();
                currentFrame.controller = _this;
                if(!(typeof json["hands"] === "undefined")) {
                    i = 0;
                    length = json["hands"].length;
                    for(i; i < length; ++i) {
                        hand = new Leap.Hand();
                        hand.frame = currentFrame;
                        hand.direction = new Leap.Vector3(json["hands"][i].direction[0], json["hands"][i].direction[1], json["hands"][i].direction[2]);
                        hand.id = json["hands"][i].id;
                        hand.palmNormal = new Leap.Vector3(json["hands"][i].palmNormal[0], json["hands"][i].palmNormal[1], json["hands"][i].palmNormal[2]);
                        hand.palmPosition = new Leap.Vector3(json["hands"][i].palmPosition[0], json["hands"][i].palmPosition[1], json["hands"][i].palmPosition[2]);
                        hand.palmVelocity = new Leap.Vector3(json["hands"][i].palmPosition[0], json["hands"][i].palmPosition[1], json["hands"][i].palmPosition[2]);
                        hand.rotation = new Leap.Matrix(new Leap.Vector3(json["hands"][i].r[0][0], json["hands"][i].r[0][1], json["hands"][i].r[0][2]), new Leap.Vector3(json["hands"][i].r[1][0], json["hands"][i].r[1][1], json["hands"][i].r[1][2]), new Leap.Vector3(json["hands"][i].r[2][0], json["hands"][i].r[2][1], json["hands"][i].r[2][2]));
                        hand.scaleFactorNumber = json["hands"][i].s;
                        hand.sphereCenter = new Leap.Vector3(json["hands"][i].sphereCenter[0], json["hands"][i].sphereCenter[1], json["hands"][i].sphereCenter[2]);
                        hand.sphereRadius = json["hands"][i].sphereRadius;
                        hand.translationVector = new Leap.Vector3(json["hands"][i].t[0], json["hands"][i].t[1], json["hands"][i].t[2]);
                        currentFrame.hands.push(hand);
                    }
                }
                currentFrame.id = json["id"];
                if(!(typeof json["pointables"] === "undefined")) {
                    i = 0;
                    length = json["pointables"].length;
                    for(i; i < length; ++i) {
                        isTool = json["pointables"][i].tool;
                        if(isTool) {
                            pointable = new Leap.Tool();
                        } else {
                            pointable = new Leap.Finger();
                        }
                        pointable.frame = currentFrame;
                        pointable.id = json["pointables"][i].id;
                        pointable.hand = _this.getHandByID(currentFrame, json["pointables"][i].handId);
                        pointable.length = json["pointables"][i].length;
                        pointable.direction = new Leap.Vector3(json["pointables"][i].direction[0], json["pointables"][i].direction[1], json["pointables"][i].direction[2]);
                        pointable.tipPosition = new Leap.Vector3(json["pointables"][i].tipPosition[0], json["pointables"][i].tipPosition[1], json["pointables"][i].tipPosition[2]);
                        pointable.tipVelocity = new Leap.Vector3(json["pointables"][i].tipVelocity[0], json["pointables"][i].tipVelocity[1], json["pointables"][i].tipVelocity[2]);
                        currentFrame.pointables.push(pointable);
                        if(pointable.hand) {
                            pointable.hand.pointables.push(pointable);
                        }
                        if(isTool) {
                            pointable.isTool = true;
                            pointable.isFinger = false;
                            pointable.width = json["pointables"][i].width;
                            currentFrame.tools.push(pointable);
                            if(pointable.hand) {
                                pointable.hand.tools.push(pointable);
                            }
                        } else {
                            pointable.isTool = false;
                            pointable.isFinger = true;
                            currentFrame.fingers.push(pointable);
                            if(pointable.hand) {
                                pointable.hand.fingers.push(pointable);
                            }
                        }
                    }
                }
                if(!(typeof json["gestures"] === "undefined")) {
                    i = 0;
                    length = json["gestures"].length;
                    for(i; i < length; ++i) {
                        switch(json["gestures"][i].type) {
                            case "circle":
                                gesture = new Leap.CircleGesture();
                                type = Leap.Gesture.TYPE_CIRCLE;
                                var circle = gesture;
                                circle.center = new Leap.Vector3(json["gestures"][i].center[0], json["gestures"][i].center[1], json["gestures"][i].center[2]);
                                circle.normal = new Leap.Vector3(json["gestures"][i].normal[0], json["gestures"][i].normal[1], json["gestures"][i].normal[2]);
                                circle.progress = json["gestures"][i].progress;
                                circle.radius = json["gestures"][i].radius;
                                break;
                            case "swipe":
                                gesture = new Leap.SwipeGesture();
                                type = Leap.Gesture.TYPE_SWIPE;
                                var swipe = gesture;
                                swipe.startPosition = new Leap.Vector3(json["gestures"][i].startPosition[0], json["gestures"][i].startPosition[1], json["gestures"][i].startPosition[2]);
                                swipe.position = new Leap.Vector3(json["gestures"][i].position[0], json["gestures"][i].position[1], json["gestures"][i].position[2]);
                                swipe.direction = new Leap.Vector3(json["gestures"][i].direction[0], json["gestures"][i].direction[1], json["gestures"][i].direction[2]);
                                swipe.speed = json["gestures"][i].speed;
                                break;
                            case "screenTap":
                                gesture = new Leap.ScreenTapGesture();
                                type = Leap.Gesture.TYPE_SCREEN_TAP;
                                var screenTap = gesture;
                                screenTap.position = new Leap.Vector3(json["gestures"][i].position[0], json["gestures"][i].position[1], json["gestures"][i].position[2]);
                                screenTap.direction = new Leap.Vector3(json["gestures"][i].direction[0], json["gestures"][i].direction[1], json["gestures"][i].direction[2]);
                                screenTap.progress = json["gestures"][i].progress;
                                break;
                            case "keyTap":
                                gesture = new Leap.KeyTapGesture();
                                type = Leap.Gesture.TYPE_KEY_TAP;
                                var keyTap = gesture;
                                keyTap.position = new Leap.Vector3(json["gestures"][i].position[0], json["gestures"][i].position[1], json["gestures"][i].position[2]);
                                keyTap.direction = new Leap.Vector3(json["gestures"][i].direction[0], json["gestures"][i].direction[1], json["gestures"][i].direction[2]);
                                keyTap.progress = json["gestures"][i].progress;
                                break;
                            default:
                                throw new Error("unkown gesture type");
                        }
                        var j = 0;
                        var lengthInner = 0;
                        if(!(typeof json["gestures"][i].handIds === "undefined")) {
                            j = 0;
                            lengthInner = json["gestures"][i].handIds.length;
                            for(j; j < lengthInner; ++j) {
                                var gestureHand = _this.getHandByID(currentFrame, json["gestures"][i].handIds[j]);
                                gesture.hands.push(gestureHand);
                            }
                        }
                        if(!(typeof json["gestures"][i].pointableIds === "undefined")) {
                            j = 0;
                            lengthInner = json["gestures"][i].pointableIds.length;
                            for(j; j < lengthInner; ++j) {
                                var gesturePointable = _this.getPointableByID(currentFrame, json["gestures"][i].pointableIds[j]);
                                if(gesturePointable) {
                                    gesture.pointables.push(gesturePointable);
                                }
                            }
                            if(gesture instanceof Leap.CircleGesture && gesture.pointables.length > 0) {
                                (gesture).pointable = gesture.pointables[0];
                            }
                        }
                        gesture.frame = currentFrame;
                        gesture.id = json["gestures"][i].id;
                        gesture.duration = json["gestures"][i].duration;
                        gesture.durationSeconds = gesture.duration / 1000000;
                        switch(json["gestures"][i].state) {
                            case "start":
                                gesture.state = Leap.Gesture.STATE_START;
                                break;
                            case "update":
                                gesture.state = Leap.Gesture.STATE_UPDATE;
                                break;
                            case "stop":
                                gesture.state = Leap.Gesture.STATE_STOP;
                                break;
                            default:
                                gesture.state = Leap.Gesture.STATE_INVALID;
                        }
                        gesture.type = type;
                        currentFrame._gestures.push(gesture);
                    }
                }
                if(json["r"]) {
                    currentFrame.rotation = new Leap.Matrix(new Leap.Vector3(json["r"][0][0], json["r"][0][1], json["r"][0][2]), new Leap.Vector3(json["r"][1][0], json["r"][1][1], json["r"][1][2]), new Leap.Vector3(json["r"][2][0], json["r"][2][1], json["r"][2][2]));
                }
                currentFrame.scaleFactorNumber = json["s"];
                if(json["t"]) {
                    currentFrame.translationVector = new Leap.Vector3(json["t"][0], json["t"][1], json["t"][2]);
                }
                currentFrame.timestamp = json["timestamp"];
                if(_this.frameHistory.length > 59) {
                    _this.frameHistory.splice(59, 1);
                }
                _this.frameHistory.unshift(_this.latestFrame);
                _this.latestFrame = currentFrame;
                console.log(_this.latestFrame);
            };
        }
        Controller.POLICY_DEFAULT = 0;
        Controller.POLICY_BACKGROUND_FRAMES = (1 << 0);
        Controller.prototype.onWebsocketOpenHandler = function (event) {
            console.log("Connection open...");
        };
        Controller.prototype.onWebsocketCloseHandler = function (data) {
            console.log("Connection closed...");
        };
        Controller.prototype.getHandByID = function (frame, id) {
            var returnValue = null;
            var i = 0;
            for(i; i < frame.hands.length; ++i) {
                if((frame.hands[i]).id == id) {
                    returnValue = (frame.hands[i]);
                    break;
                }
            }
            return returnValue;
        };
        Controller.prototype.getPointableByID = function (frame, id) {
            var returnValue = null;
            var i = 0;
            for(i; i < frame.pointables.length; ++i) {
                if((frame.pointables[i]).id == id) {
                    returnValue = (frame.pointables[i]);
                    break;
                }
            }
            return returnValue;
        };
        Controller.prototype.frame = function (history) {
            if (typeof history === "undefined") { history = 0; }
            var returnValue;
            if(history >= this.frameHistory.length) {
                returnValue = Leap.Frame.invalid();
            } else {
                returnValue = this.frameHistory[history];
            }
            return returnValue;
        };
        return Controller;
    })();
    Leap.Controller = Controller;    
})(Leap || (Leap = {}));
//@ sourceMappingURL=Controller.js.map
