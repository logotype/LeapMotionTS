[<img src="http://logotype.se/leapmotion/logo_ts.png">](https://github.com/logotype/LeapMotionTS)

This is the TypeScript framework for working with Leap Motion.

Leap Motion is a motion-control software and hardware company developing the world's most powerful and sensitive 3D motion-control and motion-sensing technology.

[leapmotion.com](http://www.leapmotion.com)

TypeScript is a free and open source programming language developed by Microsoft. TypeScript adds optional types, classes, interfaces and modules to JavaScript. TypeScript supports tools for large-scale JavaScript applications for any browser, for any host, on any OS. TypeScript compiles to readable, standards-based JavaScript.

[typescriptlang.org](http://www.typescriptlang.org)

Quick start
-----------

Clone the repo, `git clone git://github.com/logotype/LeapMotionTS.git`.

Import the library and create an instance of the Controller class. What you'll get from the `LEAPMOTION_FRAME` handler is a `Frame` instance,
with strongly typed properties such as `Hands`, `Pointables`, `Direction`, `Gestures` and more:

    import Leap = require('../LeapMotionTS');
    var controller:Leap.Controller = new Leap.Controller();
    controller.addEventListener(Leap.LeapEvent.LEAPMOTION_CONNECTED, (event:Leap.LeapEvent) => {
        controller.enableGesture(Leap.Type.TYPE_CIRCLE, true);
        controller.enableGesture(Leap.Type.TYPE_SWIPE, true);
        controller.enableGesture(Leap.Type.TYPE_SCREEN_TAP, true);
        controller.enableGesture(Leap.Type.TYPE_KEY_TAP, true);
    });
    controller.addEventListener(Leap.LeapEvent.LEAPMOTION_FRAME, (event:Leap.LeapEvent) => {
        var frame:Leap.Frame = event.frame;
        console.log("Frame id:" + frame.id + ", timestamp:" + frame.timestamp + ", hands:" + frame.hands.length + ", fingers:" + frame.fingers.length + ", tools:" + frame.tools.length + ", gestures:" + frame.gestures().length);

        if (frame.hands.length > 0) {
            // Get the first hand
            var hand:Leap.Hand = frame.hands[0];

            // Check if the hand has any fingers
            var fingers:Leap.Finger[] = hand.fingers;
            if (fingers.length > 0) {
                // Calculate the hand's average finger tip position
                var avgPos:Leap.Vector3 = Leap.Vector3.zero();
                for (var i:number = 0; i < fingers.length; i++)
                    avgPos = avgPos.plus((<Leap.Finger>fingers[i]).tipPosition);

                avgPos = avgPos.divide(fingers.length);
                console.log("Hand has " + fingers.length + " fingers, average finger tip position:" + avgPos);
            }

            // Get the hand's sphere radius and palm position
            console.log("Hand sphere radius:" + hand.sphereRadius + " mm, palm position:" + hand.palmPosition);

            // Get the hand's normal vector and direction
            var normal:Leap.Vector3 = hand.palmNormal;
            var direction:Leap.Vector3 = hand.direction;

            // Calculate the hand's pitch, roll, and yaw angles
            console.log("Hand pitch:" + Leap.LeapUtil.toDegrees(direction.pitch) + " degrees, " + "roll:" + Leap.LeapUtil.toDegrees(normal.roll) + " degrees, " + "yaw:" + Leap.LeapUtil.toDegrees(direction.yaw) + " degrees\n");
        }

        var gestures:Leap.Gesture[] = frame.gestures();
        for (var i:number = 0; i < gestures.length; i++) {
            var gesture:Leap.Gesture = gestures[i];

            switch (gesture.type) {
                case Leap.Type.TYPE_CIRCLE:
                    var circle:Leap.CircleGesture = <Leap.CircleGesture>gesture;

                    // Calculate clock direction using the angle between circle normal and pointable
                    var clockwiseness:string;
                    if (circle.pointable.direction.angleTo(circle.normal) <= Math.PI / 4) {
                        // Clockwise if angle is less than 90 degrees
                        clockwiseness = "clockwise";
                    } else {
                        clockwiseness = "counterclockwise";
                    }

                    // Calculate angle swept since last frame
                    var sweptAngle:number = 0;
                    if (circle.state != Leap.State.STATE_START) {
                        var previousGesture:Leap.Gesture = controller.frame(1).gesture(circle.id);
                        if (previousGesture.isValid()) {
                            var previousUpdate:Leap.CircleGesture = (<Leap.CircleGesture>controller.frame(1).gesture(circle.id));
                            sweptAngle = (circle.progress - previousUpdate.progress) * 2 * Math.PI;
                        }
                    }
                    console.log("Circle id:" + circle.id + ", " + circle.state + ", progress:" + circle.progress + ", radius:" + circle.radius + ", angle:" + Leap.LeapUtil.toDegrees(sweptAngle) + ", " + clockwiseness);
                    break;
                case Leap.Type.TYPE_SWIPE:
                    var swipe:Leap.SwipeGesture = <Leap.SwipeGesture>gesture;
                    console.log("Swipe id:" + swipe.id + ", " + swipe.state + ", position:" + swipe.position + ", direction:" + swipe.direction + ", speed:" + swipe.speed);
                    break;
                case Leap.Type.TYPE_SCREEN_TAP:
                    var screenTap:Leap.ScreenTapGesture = <Leap.ScreenTapGesture>gesture;
                    console.log("Screen Tap id:" + screenTap.id + ", " + screenTap.state + ", position:" + screenTap.position + ", direction:" + screenTap.direction);
                    break;
                case Leap.Type.TYPE_KEY_TAP:
                    var keyTap:Leap.KeyTapGesture = <Leap.KeyTapGesture>gesture;
                    console.log("Key Tap id:" + keyTap.id + ", " + keyTap.state + ", position:" + keyTap.position + ", direction:" + keyTap.direction);
                    break;
            }
        }
    });

Example output:

    Frame id:1125277, timestamp:14800590398, hands:1, fingers:5, tools:0, gestures:5
    Hand has 5 fingers, average finger tip position:[Vector3 x:4.767591999999996 y:129.5072 z:-28.39772]
    Hand sphere radius:136.979 mm, palm position:[Vector3 x:19.067 y:127.976 z:42.0272]
    Hand pitch:6.500235603666339 degrees, roll:6.0708401144239925 degrees, yaw:-9.621146044782972 degrees
    Circle id:27, 2, progress:3.92605, radius:43.2705, angle:13.417199999999967, counterclockwise
    Circle id:25, 2, progress:3.90497, radius:40.3004, angle:13.489199999999961, counterclockwise

Optionally, you can simply call `controller.frame()` e.g. in your main loop, or implement the `Listener` interface for callbacks.

Authors
-------

**Victor Norgren**

+ http://twitter.com/logotype
+ http://github.com/logotype
+ https://logotype.se

Copyright and license
---------------------

Copyright © 2014 logotype

Author: Victor Norgren

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:  The above copyright
notice and this permission notice shall be included in all copies or
substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE. 
