/// <reference path="CircleGesture.ts"/>
/// <reference path="Controller.ts"/>
/// <reference path="Finger.ts"/>
/// <reference path="Frame.ts"/>
/// <reference path="Gesture.ts"/>
/// <reference path="Hand.ts"/>
/// <reference path="KeyTapGesture.ts"/>
/// <reference path="Matrix.ts"/>
/// <reference path="Pointable.ts"/>
/// <reference path="ScreenTapGesture.ts"/>
/// <reference path="SwipeGesture.ts"/>
/// <reference path="Tool.ts"/>
/// <reference path="Vector3.ts"/>
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