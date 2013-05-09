/// <reference path="Frame.ts"/>
/// <reference path="CircleGesture.ts"/>
/// <reference path="KeyTapGesture.ts"/>
/// <reference path="ScreenTapGesture.ts"/>
/// <reference path="SwipeGesture.ts"/>
module Leap
{
    export class LeapEvent {
        static public LEAPMOTION_FRAME:string = "leapMotionFrame";

        private _type:string;
        private _target:any;

        public frame:Frame;

        constructor(type:string, targetObj:any, frame:Frame) {
            this._type = type;
            this._target = targetObj;
            this.frame = frame;
        }

        public getTarget():any {
            return this._target;
        }

        public getType():string {
            return this._type;
        }
    }

    export class EventDispatcher {
        private _listeners:any[];
        constructor() {
            this._listeners = [];
        }

        public hasEventListener(type:string, listener:Function):Boolean {
            var exists:Boolean = false;
            for (var i = 0; i < this._listeners.length; i++) {
                if (this._listeners[i].type === type && this._listeners[i].listener === listener) {
                    exists = true;
                }
            }

            return exists;
        }

        public addEventListener (typeStr:string, listenerFunc:Function):void {
            if (this.hasEventListener(typeStr, listenerFunc)) {
                return;
            }

            this._listeners.push({type: typeStr, listener: listenerFunc});
        }

        public removeEventListener (typeStr:string, listenerFunc:Function):void {
            for (var i = 0; i < this._listeners.length; i++) {
                if (this._listeners[i].type === typeStr && this._listeners[i].listener === listenerFunc) {
                    this._listeners.splice(i, 1);
                }
            }
        }

        public dispatchEvent (evt:LeapEvent) {
            for (var i = 0; i < this._listeners.length; i++) {
                if (this._listeners[i].type === evt.getType()) {
                    this._listeners[i].listener.call(this, evt);
                }
            }
        }
    }

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
    export class Controller extends EventDispatcher
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
         * History of frame of tracking data from the Leap.
         */
        public frameHistory:Frame[] = [];

        /**
         * Most recent received Frame.
         */
        private latestFrame:Frame;

        /**
         * Socket connection.
         */
        public connection:WebSocket;

        /**
         * Finds a Hand object by ID.
         *
         * @param frame The Frame object in which the Hand contains
         * @param id The ID of the Hand object
         * @return The Hand object if found, otherwise null
         *
         */
        private getHandByID( frame:Frame, id:number ):Hand
        {
            var returnValue:Hand = null;
            var i:number = 0;

            for( i; i < frame.hands.length; ++i )
            {
                if ( (<Hand>frame.hands[ i ]).id == id )
                {
                    returnValue = (<Hand>frame.hands[ i ]);
                    break;
                }
            }
            return returnValue;
        }

        /**
         * Constructs a Controller object.
         * @param host IP or hostname of the computer running the Leap software.
         * (currently only supported for socket connections).
         *
         */
            constructor( host:string = null )
        {
            super();

            if(!host)
            {
                this.connection = new WebSocket("ws://localhost:6437");
            }
            else
            {
                this.connection = new WebSocket("ws://" + host + ":6437");
            }

            this.connection.onopen = this.onWebsocketOpenHandler;
            this.connection.onclose = this.onWebsocketCloseHandler;
            this.connection.onmessage = ( data:Object ) =>
            {
                var i:number;
                var json:Object;
                var currentFrame:Frame;
                var hand:Hand;
                var pointable:Pointable;
                var gesture:Gesture;
                var isTool:Boolean;
                var length:number;
                var type:number;

                json = JSON.parse( data["data"] );

                // Ignore all other data than Frames
                if( (typeof json["timestamp"] === "undefined") )
                {
                    return;
                }

                currentFrame = new Frame();
                currentFrame.controller = this;

                // Hands
                if ( !(typeof json["hands"] === "undefined") )
                {
                    i = 0;
                    length = json["hands"].length;
                    for ( i; i < length; ++i )
                    {
                        hand = new Hand();
                        hand.frame = currentFrame;
                        hand.direction = new Vector3( json["hands"][ i ].direction[ 0 ], json["hands"][ i ].direction[ 1 ], json["hands"][ i ].direction[ 2 ] );
                        hand.id = json["hands"][ i ].id;
                        hand.palmNormal = new Vector3( json["hands"][ i ].palmNormal[ 0 ], json["hands"][ i ].palmNormal[ 1 ], json["hands"][ i ].palmNormal[ 2 ] );
                        hand.palmPosition = new Vector3( json["hands"][ i ].palmPosition[ 0 ], json["hands"][ i ].palmPosition[ 1 ], json["hands"][ i ].palmPosition[ 2 ] );
                        hand.palmVelocity = new Vector3( json["hands"][ i ].palmPosition[ 0 ], json["hands"][ i ].palmPosition[ 1 ], json["hands"][ i ].palmPosition[ 2 ] );
                        hand.rotation = new Matrix( new Vector3( json["hands"][ i ].r[ 0 ][ 0 ], json["hands"][ i ].r[ 0 ][ 1 ], json["hands"][ i ].r[ 0 ][ 2 ] ), new Vector3( json["hands"][ i ].r[ 1 ][ 0 ], json["hands"][ i ].r[ 1 ][ 1 ], json["hands"][ i ].r[ 1 ][ 2 ] ), new Vector3( json["hands"][ i ].r[ 2 ][ 0 ], json["hands"][ i ].r[ 2 ][ 1 ], json["hands"][ i ].r[ 2 ][ 2 ] ) );
                        hand.scaleFactorNumber = json["hands"][ i ].s;
                        hand.sphereCenter = new Vector3( json["hands"][ i ].sphereCenter[ 0 ], json["hands"][ i ].sphereCenter[ 1 ], json["hands"][ i ].sphereCenter[ 2 ] );
                        hand.sphereRadius = json["hands"][ i ].sphereRadius;
                        hand.translationVector = new Vector3( json["hands"][ i ].t[ 0 ], json["hands"][ i ].t[ 1 ], json["hands"][ i ].t[ 2 ] );
                        currentFrame.hands.push( hand );
                    }
                }

                // ID
                currentFrame.id = json["id"];

                // Pointables
                if ( !(typeof json["pointables"] === "undefined") )
                {
                    i = 0;
                    length = json["pointables"].length;
                    for ( i; i < length; ++i )
                    {
                        isTool = json["pointables"][ i ].tool;
                        if ( isTool )
                            pointable = new Tool();
                        else
                            pointable = new Finger();

                        pointable.frame = currentFrame;
                        pointable.id = json["pointables"][ i ].id;
                        pointable.hand = this.getHandByID( currentFrame, json["pointables"][ i ].handId );
                        pointable.length = json["pointables"][ i ].length;
                        pointable.direction = new Vector3( json["pointables"][ i ].direction[ 0 ], json["pointables"][ i ].direction[ 1 ], json["pointables"][ i ].direction[ 2 ] );
                        pointable.tipPosition = new Vector3( json["pointables"][ i ].tipPosition[ 0 ], json["pointables"][ i ].tipPosition[ 1 ], json["pointables"][ i ].tipPosition[ 2 ] );
                        pointable.tipVelocity = new Vector3( json["pointables"][ i ].tipVelocity[ 0 ], json["pointables"][ i ].tipVelocity[ 1 ], json["pointables"][ i ].tipVelocity[ 2 ] );
                        currentFrame.pointables.push( pointable );

                        if ( pointable.hand )
                            pointable.hand.pointables.push( pointable );

                        if ( isTool )
                        {
                            pointable.isTool = true;
                            pointable.isFinger = false;
                            pointable.width = json["pointables"][ i ].width;
                            currentFrame.tools.push( <Tool>pointable );
                            if ( pointable.hand )
                                pointable.hand.tools.push( <Tool>pointable );
                        }
                        else
                        {
                            pointable.isTool = false;
                            pointable.isFinger = true;
                            currentFrame.fingers.push( <Finger>pointable );
                            if ( pointable.hand )
                                pointable.hand.fingers.push( <Finger>pointable );
                        }
                    }
                }

                // Gestures
                if ( !(typeof json["gestures"] === "undefined") )
                {
                    i = 0;
                    length = json["gestures"].length;
                    for ( i; i < length; ++i )
                    {
                        switch( json["gestures"][ i ].type )
                        {
                            case "circle":
                                gesture = new CircleGesture();
                                type = Gesture.TYPE_CIRCLE;
                                var circle:CircleGesture = <CircleGesture>gesture;

                                circle.center = new Vector3( json["gestures"][ i ].center[ 0 ], json["gestures"][ i ].center[ 1 ], json["gestures"][ i ].center[ 2 ] );
                                circle.normal = new Vector3( json["gestures"][ i ].normal[ 0 ], json["gestures"][ i ].normal[ 1 ], json["gestures"][ i ].normal[ 2 ] );
                                circle.progress = json["gestures"][ i ].progress;
                                circle.radius = json["gestures"][ i ].radius;
                                break;

                            case "swipe":
                                gesture = new SwipeGesture();
                                type = Gesture.TYPE_SWIPE;

                                var swipe:SwipeGesture = <SwipeGesture>gesture;

                                swipe.startPosition = new Vector3( json["gestures"][ i ].startPosition[ 0 ], json["gestures"][ i ].startPosition[ 1 ], json["gestures"][ i ].startPosition[ 2 ] );
                                swipe.position = new Vector3( json["gestures"][ i ].position[ 0 ], json["gestures"][ i ].position[ 1 ], json["gestures"][ i ].position[ 2 ] );
                                swipe.direction = new Vector3( json["gestures"][ i ].direction[ 0 ], json["gestures"][ i ].direction[ 1 ], json["gestures"][ i ].direction[ 2 ] );
                                swipe.speed = json["gestures"][ i ].speed;
                                break;

                            case "screenTap":
                                gesture = new ScreenTapGesture();
                                type = Gesture.TYPE_SCREEN_TAP;

                                var screenTap:ScreenTapGesture = <ScreenTapGesture>gesture;
                                screenTap.position = new Vector3( json["gestures"][ i ].position[ 0 ], json["gestures"][ i ].position[ 1 ], json["gestures"][ i ].position[ 2 ] );
                                screenTap.direction = new Vector3( json["gestures"][ i ].direction[ 0 ], json["gestures"][ i ].direction[ 1 ], json["gestures"][ i ].direction[ 2 ] );
                                screenTap.progress = json["gestures"][ i ].progress;
                                break;

                            case "keyTap":
                                gesture = new KeyTapGesture();
                                type = Gesture.TYPE_KEY_TAP;

                                var keyTap:KeyTapGesture = <KeyTapGesture>gesture;
                                keyTap.position = new Vector3( json["gestures"][ i ].position[ 0 ], json["gestures"][ i ].position[ 1 ], json["gestures"][ i ].position[ 2 ] );
                                keyTap.direction = new Vector3( json["gestures"][ i ].direction[ 0 ], json["gestures"][ i ].direction[ 1 ], json["gestures"][ i ].direction[ 2 ] );
                                keyTap.progress = json["gestures"][ i ].progress;
                                break;

                            default:
                                throw new Error( "unkown gesture type" );
                        }

                        var j:number = 0;
                        var lengthInner:number = 0;

                        if( !(typeof json["gestures"][ i ].handIds === "undefined") )
                        {
                            j = 0;
                            lengthInner = json["gestures"][ i ].handIds.length;
                            for( j; j < lengthInner; ++j )
                            {
                                var gestureHand:Hand = this.getHandByID( currentFrame, json["gestures"][ i ].handIds[ j ] );
                                gesture.hands.push( gestureHand );
                            }
                        }

                        if( !(typeof json["gestures"][ i ].pointableIds === "undefined") )
                        {
                            j = 0;
                            lengthInner = json["gestures"][ i ].pointableIds.length;
                            for( j; j < lengthInner; ++j )
                            {
                                var gesturePointable:Pointable = this.getPointableByID( currentFrame, json["gestures"][ i ].pointableIds[ j ] );
                                if( gesturePointable )
                                {
                                    gesture.pointables.push( gesturePointable );
                                }
                            }
                            if( gesture instanceof CircleGesture && gesture.pointables.length > 0 )
                            {
                                (<CircleGesture>gesture).pointable = gesture.pointables[ 0 ];
                            }
                        }

                        gesture.frame = currentFrame;
                        gesture.id = json["gestures"][ i ].id;
                        gesture.duration = json["gestures"][ i ].duration;
                        gesture.durationSeconds = gesture.duration / 1000000;

                        switch( json["gestures"][ i ].state )
                        {
                            case "start":
                                gesture.state = Gesture.STATE_START;
                                break;
                            case "update":
                                gesture.state = Gesture.STATE_UPDATE;
                                break;
                            case "stop":
                                gesture.state = Gesture.STATE_STOP;
                                break;
                            default:
                                gesture.state = Gesture.STATE_INVALID;
                        }

                        gesture.type = type;

                        currentFrame._gestures.push( gesture );
                    }
                }

                // Rotation (since last frame), interpolate for smoother motion
                if ( json["r"] )
                    currentFrame.rotation = new Matrix( new Vector3( json["r"][ 0 ][ 0 ], json["r"][ 0 ][ 1 ], json["r"][ 0 ][ 2 ] ), new Vector3( json["r"][ 1 ][ 0 ], json["r"][ 1 ][ 1 ], json["r"][ 1 ][ 2 ] ), new Vector3( json["r"][ 2 ][ 0 ], json["r"][ 2 ][ 1 ], json["r"][ 2 ][ 2 ] ) );

                // Scale factor (since last frame), interpolate for smoother motion
                currentFrame.scaleFactorNumber = json["s"];

                // Translation (since last frame), interpolate for smoother motion
                if ( json["t"] )
                    currentFrame.translationVector = new Vector3( json["t"][ 0 ], json["t"][ 1 ], json["t"][ 2 ] );

                // Timestamp
                currentFrame.timestamp = json["timestamp"];

                // Add frame to history
                if ( this.frameHistory.length > 59 )
                    this.frameHistory.splice( 59, 1 );

                this.frameHistory.unshift( this.latestFrame );
                this.latestFrame = currentFrame;

                this.dispatchEvent( new LeapEvent(LeapEvent.LEAPMOTION_FRAME, this.latestFrame.controller, this.latestFrame));
                //controller.leapmotion::listener.onFrame( controller, latestFrame );
            };
        }

        private onWebsocketOpenHandler( event:Event ):void
        {
            console.log( "Connection open..." );
        }

        private onWebsocketCloseHandler( data:Object ):void
        {
            console.log( "Connection closed..." );
        }

        /**
         * Finds a Pointable object by ID.
         *
         * @param frame The Frame object in which the Pointable contains
         * @param id The ID of the Pointable object
         * @return The Pointable object if found, otherwise null
         *
         */
        private getPointableByID( frame:Frame, id:number ):Pointable
        {
            var returnValue:Pointable = null;
            var i:number = 0;

            for( i; i < frame.pointables.length; ++i )
            {
                if ( (<Pointable>frame.pointables[ i ]).id == id )
                {
                    returnValue = (<Pointable>frame.pointables[ i ]);
                    break;
                }
            }
            return returnValue;
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