define(["require", "exports", '../build/leapmotionts-2.2.3'], function(require, exports, Leap) {
    var controller = new Leap.Controller();
    controller.addEventListener(Leap.LeapEvent.LEAPMOTION_CONNECTED, function (event) {
        controller.enableGesture(6 /* TYPE_CIRCLE */, true);
        controller.enableGesture(5 /* TYPE_SWIPE */, true);
        controller.enableGesture(7 /* TYPE_SCREEN_TAP */, true);
        controller.enableGesture(8 /* TYPE_KEY_TAP */, true);
    });
    controller.addEventListener(Leap.LeapEvent.LEAPMOTION_FRAME, function (event) {
        var frame = event.frame;
        console.log("Frame id:" + frame.id + ", timestamp:" + frame.timestamp + ", hands:" + frame.hands.length + ", fingers:" + frame.fingers.length + ", tools:" + frame.tools.length + ", gestures:" + frame.gestures().length);

        if (frame.hands.length > 0) {
            // Get the first hand
            var hand = frame.hands[0];

            // Check if the hand has any fingers
            var fingers = hand.fingers;
            if (fingers.length > 0) {
                // Calculate the hand's average finger tip position
                var avgPos = Leap.Vector3.zero();
                for (var i = 0; i < fingers.length; i++)
                    avgPos = avgPos.plus(fingers[i].tipPosition);

                avgPos = avgPos.divide(fingers.length);
                console.log("Hand has " + fingers.length + " fingers, average finger tip position:" + avgPos);
            }

            // Get the hand's sphere radius and palm position
            console.log("Hand sphere radius:" + hand.sphereRadius + " mm, palm position:" + hand.palmPosition);

            // Get the hand's normal vector and direction
            var normal = hand.palmNormal;
            var direction = hand.direction;

            // Calculate the hand's pitch, roll, and yaw angles
            console.log("Hand pitch:" + Leap.LeapUtil.toDegrees(direction.pitch) + " degrees, " + "roll:" + Leap.LeapUtil.toDegrees(normal.roll) + " degrees, " + "yaw:" + Leap.LeapUtil.toDegrees(direction.yaw) + " degrees\n");
        }

        var gestures = frame.gestures();
        for (var i = 0; i < gestures.length; i++) {
            var gesture = gestures[i];

            switch (gesture.type) {
                case 6 /* TYPE_CIRCLE */:
                    var circle = gesture;

                    // Calculate clock direction using the angle between circle normal and pointable
                    var clockwiseness;
                    if (circle.pointable.direction.angleTo(circle.normal) <= Math.PI / 4) {
                        // Clockwise if angle is less than 90 degrees
                        clockwiseness = "clockwise";
                    } else {
                        clockwiseness = "counterclockwise";
                    }

                    // Calculate angle swept since last frame
                    var sweptAngle = 0;
                    if (circle.state != 1 /* STATE_START */) {
                        var previousGesture = controller.frame(1).gesture(circle.id);
                        if (previousGesture.isValid()) {
                            var previousUpdate = controller.frame(1).gesture(circle.id);
                            sweptAngle = (circle.progress - previousUpdate.progress) * 2 * Math.PI;
                        }
                    }
                    console.log("Circle id:" + circle.id + ", " + circle.state + ", progress:" + circle.progress + ", radius:" + circle.radius + ", angle:" + Leap.LeapUtil.toDegrees(sweptAngle) + ", " + clockwiseness);
                    break;
                case 5 /* TYPE_SWIPE */:
                    var swipe = gesture;
                    console.log("Swipe id:" + swipe.id + ", " + swipe.state + ", position:" + swipe.position + ", direction:" + swipe.direction + ", speed:" + swipe.speed);
                    break;
                case 7 /* TYPE_SCREEN_TAP */:
                    var screenTap = gesture;
                    console.log("Screen Tap id:" + screenTap.id + ", " + screenTap.state + ", position:" + screenTap.position + ", direction:" + screenTap.direction);
                    break;
                case 8 /* TYPE_KEY_TAP */:
                    var keyTap = gesture;
                    console.log("Key Tap id:" + keyTap.id + ", " + keyTap.state + ", position:" + keyTap.position + ", direction:" + keyTap.direction);
                    break;
            }
        }
    });
});
//# sourceMappingURL=sample.js.map
