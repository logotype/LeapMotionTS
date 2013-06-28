define(["require", "exports", '../LeapMotionTS'], function(require, exports, __Leap__) {
    var Leap = __Leap__;
    var controller = new Leap.Controller();
    controller.addEventListener(Leap.LeapEvent.LEAPMOTION_CONNECTED, function (event) {
        controller.enableGesture(Leap.Type.TYPE_CIRCLE, true);
        controller.enableGesture(Leap.Type.TYPE_SWIPE, true);
        controller.enableGesture(Leap.Type.TYPE_SCREEN_TAP, true);
        controller.enableGesture(Leap.Type.TYPE_KEY_TAP, true);
    });
    controller.addEventListener(Leap.LeapEvent.LEAPMOTION_FRAME, function (event) {
        var frame = event.frame;
        console.log("Frame id:" + frame.id + ", timestamp:" + frame.timestamp + ", hands:" + frame.hands.length + ", fingers:" + frame.fingers.length + ", tools:" + frame.tools.length + ", gestures:" + frame.gestures().length);

        if (frame.hands.length > 0) {
            var hand = frame.hands[0];

            var fingers = hand.fingers;
            if (fingers.length > 0) {
                var avgPos = Leap.Vector3.zero();
                for (var i = 0; i < fingers.length; i++)
                    avgPos = avgPos.plus((fingers[i]).tipPosition);

                avgPos = avgPos.divide(fingers.length);
                console.log("Hand has " + fingers.length + " fingers, average finger tip position:" + avgPos);
            }

            console.log("Hand sphere radius:" + hand.sphereRadius + " mm, palm position:" + hand.palmPosition);

            var normal = hand.palmNormal;
            var direction = hand.direction;

            console.log("Hand pitch:" + Leap.LeapUtil.toDegrees(direction.pitch) + " degrees, " + "roll:" + Leap.LeapUtil.toDegrees(normal.roll) + " degrees, " + "yaw:" + Leap.LeapUtil.toDegrees(direction.yaw) + " degrees\n");
        }

        var gestures = frame.gestures();
        for (var i = 0; i < gestures.length; i++) {
            var gesture = gestures[i];

            switch (gesture.type) {
                case Leap.Type.TYPE_CIRCLE:
                    var circle = gesture;

                    var clockwiseness;
                    if (circle.pointable.direction.angleTo(circle.normal) <= Math.PI / 4) {
                        clockwiseness = "clockwise";
                    } else {
                        clockwiseness = "counterclockwise";
                    }

                    var sweptAngle = 0;
                    if (circle.state != Leap.State.STATE_START) {
                        var previousGesture = controller.frame(1).gesture(circle.id);
                        if (previousGesture.isValid()) {
                            var previousUpdate = (controller.frame(1).gesture(circle.id));
                            sweptAngle = (circle.progress - previousUpdate.progress) * 2 * Math.PI;
                        }
                    }
                    console.log("Circle id:" + circle.id + ", " + circle.state + ", progress:" + circle.progress + ", radius:" + circle.radius + ", angle:" + Leap.LeapUtil.toDegrees(sweptAngle) + ", " + clockwiseness);
                    break;
                case Leap.Type.TYPE_SWIPE:
                    var swipe = gesture;
                    console.log("Swipe id:" + swipe.id + ", " + swipe.state + ", position:" + swipe.position + ", direction:" + swipe.direction + ", speed:" + swipe.speed);
                    break;
                case Leap.Type.TYPE_SCREEN_TAP:
                    var screenTap = gesture;
                    console.log("Screen Tap id:" + screenTap.id + ", " + screenTap.state + ", position:" + screenTap.position + ", direction:" + screenTap.direction);
                    break;
                case Leap.Type.TYPE_KEY_TAP:
                    var keyTap = gesture;
                    console.log("Key Tap id:" + keyTap.id + ", " + keyTap.state + ", position:" + keyTap.position + ", direction:" + keyTap.direction);
                    break;
            }
        }
    });
});
//@ sourceMappingURL=sample.js.map
