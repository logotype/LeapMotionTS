/// <reference path="Frame.ts"/>
module Leap
{
    /**
     * The Controller class is your main interface to the Leap Motion Controller.
     *
     * <p>Create an instance of this Controller class to access frames of tracking
     * data and configuration information. Frame data can be polled at any time using
     * the <code>Controller::frame()</code> . Call <code>frame()</code> or <code>frame(0)</code>
     * to get the most recent frame. Set the history parameter to a positive integer
     * to access previous frames. A controller stores up to 60 frames in its frame history.</p>
     *
     * <p>Polling is an appropriate strategy for applications which already have an
     * intrinsic update loop, such as a game. You can also implement the Leap::Listener
     * interface to handle events as they occur. The Leap dispatches events to the listener
     * upon initialization and exiting, on connection changes, and when a new frame
     * of tracking data is available. When these events occur, the controller object
     * invokes the appropriate callback defined in the Listener interface.</p>
     *
     * <p>To access frames of tracking data as they become available:</p>
     *
     * <ul>
     * <li>Implement the Listener interface and override the <code>Listener::onFrame()</code> .</li>
     * <li>In your <code>Listener::onFrame()</code> , call the <code>Controller::frame()</code> to access the newest frame of tracking data.</li>
     * <li>To start receiving frames, create a Controller object and add event listeners to the <code>Controller::addEventListener()</code> .</li>
     * </ul>
     *
     * <p>When an instance of a Controller object has been initialized,
     * it calls the <code>Listener::onInit()</code> when the listener is ready for use.
     * When a connection is established between the controller and the Leap,
     * the controller calls the <code>Listener::onConnect()</code> . At this point,
     * your application will start receiving frames of data. The controller calls
     * the <code>Listener::onFrame()</code> each time a new frame is available.
     * If the controller loses its connection with the Leap software or
     * device for any reason, it calls the <code>Listener::onDisconnect()</code> .
     * If the listener is removed from the controller or the controller is destroyed,
     * it calls the <code>Listener::onExit()</code> . At that point, unless the listener
     * is added to another controller again, it will no longer receive frames of tracking data.</p>
     *
     * @author logotype
     *
     */
    export class Controller
    {
        /**
         * The default policy.
         *
         * <p>Currently, the only supported policy is the background frames policy,
         * which determines whether your application receives frames of tracking
         * data when it is not the focused, foreground application.</p>
         */
        static public POLICY_DEFAULT:number = 0;

        /**
         * Receive background frames.
         *
         * <p>Currently, the only supported policy is the background frames policy,
         * which determines whether your application receives frames of tracking
         * data when it is not the focused, foreground application.</p>
         */
        static public POLICY_BACKGROUND_FRAMES:number = (1 << 0);

        /**
         * @private
         * The Listener subclass instance.
         */
        //leapmotion listener:Listener;

        /**
         * @private
         * Current connection, either native or socket.
         */
        //public connection:ILeapConnection;

        /**
         * @private
         * History of frame of tracking data from the Leap.
         */
        public frameHistory:Leap.Frame[] = [];

        /**
         * @private
         * Native Extension context object.
         *
         */
        public context:Object;

        /**
         * @private
         * List of Screen objects, created by <code>locatedScreens()</code>.
         */
        //private _screenList:Vector.<Screen> = new Vector.<Screen>();

        /**
         * Constructs a Controller object.
         * @param host IP or hostname of the computer running the Leap software.
         * (currently only supported for socket connections).
         *
         */
        constructor( host:string = null )
        {
        }

        /**
         * Returns a frame of tracking data from the Leap.
         *
         * <p>Use the optional history parameter to specify which frame to retrieve.
         * Call <code>frame()</code> or <code>frame(0)</code> to access the most recent frame;
         * call <code>frame(1)</code> to access the previous frame, and so on. If you use a history value
         * greater than the number of stored frames, then the controller returns
         * an invalid frame.</p>
         *
         * @param history The age of the frame to return, counting backwards from
         * the most recent frame (0) into the past and up to the maximum age (59).
         *
         * @return The specified frame; or, if no history parameter is specified,
         * the newest frame. If a frame is not available at the specified
         * history position, an invalid Frame is returned.
         *
         */
        public frame( history:number = 0 ):Leap.Frame
        {
            var returnValue:Leap.Frame;

            if ( history >= this.frameHistory.length )
                returnValue = Leap.Frame.invalid();
            else
                returnValue = this.frameHistory[ history ];

            return returnValue;
        }
    }
}