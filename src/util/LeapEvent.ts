/// <reference path="./../Frame.ts"/>
/// <reference path="./../Listener.ts"/>
class LeapEvent
{
    public static LEAPMOTION_INIT:string = "leapMotionInit";
    public static LEAPMOTION_CONNECTED:string = "leapMotionConnected";
    public static LEAPMOTION_DISCONNECTED:string = "leapMotionDisconnected";
    public static LEAPMOTION_EXIT:string = "leapMotionExit";
    public static LEAPMOTION_FRAME:string = "leapMotionFrame";

    private _type:string;
    private _target:Listener;

    public frame:Frame;

    constructor( type:string, targetListener:Listener, frame:Frame = null )
    {
        this._type = type;
        this._target = targetListener;
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