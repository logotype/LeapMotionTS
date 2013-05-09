/// <reference path="modules/CircleGesture.ts"/>
/// <reference path="modules/Controller.ts"/>
/// <reference path="modules/Finger.ts"/>
/// <reference path="modules/Frame.ts"/>
/// <reference path="modules/Gesture.ts"/>
/// <reference path="modules/Hand.ts"/>
/// <reference path="modules/KeyTapGesture.ts"/>
/// <reference path="modules/Matrix.ts"/>
/// <reference path="modules/Pointable.ts"/>
/// <reference path="modules/ScreenTapGesture.ts"/>
/// <reference path="modules/SwipeGesture.ts"/>
/// <reference path="modules/Tool.ts"/>
/// <reference path="modules/Vector3.ts"/>
export module AppModule
{
    export class App
    {
        constructor()
        {
            var circleGesture:Leap.CircleGesture = new Leap.CircleGesture();
            var controller:Leap.Controller = new Leap.Controller();
            var finger:Leap.Finger = new Leap.Finger();
            var frame:Leap.Frame = new Leap.Frame();
            var gesture:Leap.Gesture = new Leap.Gesture();
            var hand:Leap.Hand = new Leap.Hand();
            var keyTapGesture:Leap.KeyTapGesture = new Leap.KeyTapGesture();
            var pointable:Leap.Pointable = new Leap.Pointable();
            var screenTapGesture:Leap.ScreenTapGesture = new Leap.ScreenTapGesture();
            var swipeGesture:Leap.SwipeGesture = new Leap.SwipeGesture();
            var tool:Leap.Tool = new Leap.Tool();
            var vector3:Leap.Vector3 = new Leap.Vector3(0, 0, 0);
            var matrix:Leap.Matrix = new Leap.Matrix(vector3, vector3, vector3);
        }
    }
}
