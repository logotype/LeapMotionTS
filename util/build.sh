#!/bin/bash
cd ${0%/*}
echo "[Combining modules...]"
cat ../modules/util/EventDispatcher.ts ../modules/Listener.ts ../modules/interfaces/DefaultListener.ts ../modules/util/LeapEvent.ts ../modules/util/LeapUtil.ts ../modules/Controller.ts ../modules/Pointable.ts ../modules/Gesture.ts ../modules/Finger.ts ../modules/Tool.ts ../modules/Hand.ts ../modules/Frame.ts ../modules/Matrix.ts ../modules/CircleGesture.ts ../modules/KeyTapGesture.ts ../modules/ScreenTapGesture.ts ../modules/SwipeGesture.ts ../modules/Vector3.ts | sed 's/\/\/\/.*$//' > ../LeapMotionTS_combined.ts

echo "[Making module/interface external...]"
sed 's/class /export class /' ../LeapMotionTS_combined.ts | sed 's/interface /export interface /' > ../LeapMotionTS.ts

echo "[Running TypeScript compiler...]"
tsc --declaration -b --module amd --target ES5 ../LeapMotionTS.ts

#echo "[Running RequireJS Optimizer...]"
#node r.js -o baseUrl=../ name=LeapMotionTS out=../LeapMotionTS_optimized.js

echo "[Running Closure Compiler...]"
java \
-jar ./build/compiler.jar \
--js_output_file ../LeapMotionTS.min.js \
--js ../LeapMotionTS.js

echo "[Clean up...]"
rm -Rf ../LeapMotionTS_combined.ts

echo "[Done!]"
