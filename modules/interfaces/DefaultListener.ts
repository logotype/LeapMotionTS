/// <reference path="./../Controller.ts"/>
/// <reference path="./../Frame.ts"/>
/// <reference path="./../util/LeapEvent.ts"/>
/// <reference path="./../Listener.ts"/>
class DefaultListener extends EventDispatcher implements Listener
{

    constructor()
    {
        super();
    }

    public onConnect( controller:Controller ):void
    {
        controller.dispatchEvent( new LeapEvent( LeapEvent.LEAPMOTION_CONNECTED, this ) );
    }

    public onDisconnect( controller:Controller ):void
    {
        controller.dispatchEvent( new LeapEvent( LeapEvent.LEAPMOTION_DISCONNECTED, this ) );
    }

    public onExit( controller:Controller ):void
    {
        controller.dispatchEvent( new LeapEvent( LeapEvent.LEAPMOTION_EXIT, this ) );
    }

    public onFrame( controller:Controller, frame:Frame ):void
    {
        controller.dispatchEvent( new LeapEvent( LeapEvent.LEAPMOTION_FRAME, this, frame ) );
    }

    public onInit( controller:Controller ):void
    {
        controller.dispatchEvent( new LeapEvent( LeapEvent.LEAPMOTION_INIT, this ) );
    }
}
