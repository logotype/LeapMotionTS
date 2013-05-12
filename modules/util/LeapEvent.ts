/// <reference path="../Frame.ts"/>
class LeapEvent
{
    public static LEAPMOTION_INIT:string = "leapMotionInit";
    public static LEAPMOTION_CONNECTED:string = "leapMotionConnected";
    public static LEAPMOTION_DISCONNECTED:string = "leapMotionDisconnected";
    public static LEAPMOTION_EXIT:string = "leapMotionExit";
    public static LEAPMOTION_FRAME:string = "leapMotionFrame";

    private _type:string;
    private _target:any;

    public frame:Frame;

    constructor( type:string, targetObj:any, frame:Frame = null )
    {
        this._type = type;
        this._target = targetObj;
        this.frame = frame;
    }

    public getTarget():any
    {
        return this._target;
    }

    public getType():string
    {
        return this._type;
    }
}