
/**
 * The EventDispatcher export class provides strongly typed events.
 */
export class EventDispatcher
{
    private listeners:any[];

    constructor()
    {
        this.listeners = [];
    }

    public hasEventListener( type:string, listener:Function ):boolean
    {
        var exists:boolean = false;
        for( var i:number = 0; i < this.listeners.length; i++ )
        {
            if( this.listeners[ i ].type === type && this.listeners[ i ].listener === listener )
            {
                exists = true;
                break;
            }
        }

        return exists;
    }

    public addEventListener ( typeStr:string, listenerFunction:Function ):void
    {
        if( this.hasEventListener( typeStr, listenerFunction ) )
            return;

        this.listeners.push( { type: typeStr, listener: listenerFunction } );
    }

    public removeEventListener ( typeStr:string, listenerFunction:Function ):void
    {
        for( var i:number = 0; i < this.listeners.length; i++ )
        {
            if( this.listeners[ i ].type === typeStr && this.listeners[ i ].listener === listenerFunction )
                this.listeners.splice( i, 1 );
        }
    }

    public dispatchEvent ( event:LeapEvent ):void
    {
        for( var i:number = 0; i < this.listeners.length; i++ )
        {
            if( this.listeners[ i ].type === event.getType() )
                this.listeners[ i ].listener.call( this, event );
        }
    }
}

/**
 * The Listener export interface defines a set of callback functions that you can
 * implement to respond to events dispatched by the Leap.
 *
 * <p>To handle Leap events, implement the Listener export interface and assign
 * it to the Controller instance. The Controller calls the relevant Listener
 * callback when an event occurs, passing in a reference to itself.
 * You have to implement callbacks for every method specified in the interface.</p>
 *
 * <p>Note: you have to create an instance of the LeapMotion export class and set the Listener to your class:</p>
 *
 * <listing>
 * leap = new LeapMotion();
 * leap.controller.setListener( this );</listing>
 *
 * @author logotype
 *
 */
export interface Listener
{
    /**
     * Called when the Controller object connects to the Leap software,
     * or when this Listener object is added to a Controller that is already connected.
     *
     * @param controller The Controller object invoking this callback function.
     *
     */
    onConnect( controller:Controller ):void;

    /**
     * Called when the Controller object disconnects from the Leap software.
     *
     * <p>The controller can disconnect when the Leap device is unplugged,
     * the user shuts the Leap software down, or the Leap software encounters
     * an unrecoverable error.</p>
     *
     * <listing>
     * public onDisconnect( controller:Controller ):void {
     *     trace( "Disconnected" );
     * }</listing>
     *
     * <p>Note: When you launch a Leap-enabled application in a debugger,
     * the Leap library does not disconnect from the application.
     * This is to allow you to step through code without losing the connection
     * because of time outs.</p>
     *
     * @param controller The Controller object invoking this callback function.
     *
     */
    onDisconnect( controller:Controller ):void;

    /**
     * Called when this Listener object is removed from the Controller or
     * the Controller instance is destroyed.
     *
     * <listing>
     * public onExit( controller:Controller ):void {
     *     trace( "Exited" );
     * }</listing>
     *
     * @param controller The Controller object invoking this callback function.
     *
     */
    onExit( controller:Controller ):void;

    /**
     * Called when a new frame of hand and finger tracking data is available.
     *
     * <p>Access the new frame data using the <code>controller.frame()</code> function.</p>
     *
     * <listing>
     * public onFrame( controller:Controller, frame:Frame ):void {
     *     trace( "New frame" );
     * }</listing>
     *
     * <p>Note, the Controller skips any pending onFrame events while your
     * onFrame handler executes. If your implementation takes too long to
     * return, one or more frames can be skipped. The Controller still inserts
     * the skipped frames into the frame history. You can access recent frames
     * by setting the history parameter when calling the <code>controller.frame()</code>
     * function. You can determine if any pending onFrame events were skipped
     * by comparing the ID of the most recent frame with the ID of the last
     * received frame.</p>
     *
     * @param controller The Controller object invoking this callback function.
     * @param frame The most recent frame object.
     *
     */
    onFrame( controller:Controller, frame:Frame ):void;

    /**
     * Called once, when this Listener object is newly added to a Controller.
     *
     * <listing>
     * public onInit( controller:Controller ):void {
     *     trace( "Init" );
     * }</listing>
     *
     * @param controller The Controller object invoking this callback function.
     *
     */
    onInit( controller:Controller ):void;
}



export class DefaultListener extends EventDispatcher implements Listener
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


export class LeapEvent
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

/**
 * LeapUtil is a collection of static utility functions.
 *
 */
export class LeapUtil
{
    /** The constant pi as a single precision floating point number. */
    public static PI:number = 3.1415926536;

    /**
     * The constant ratio to convert an angle measure from degrees to radians.
     * Multiply a value in degrees by this constant to convert to radians.
     */
    public static DEG_TO_RAD:number = 0.0174532925;

    /**
     * The constant ratio to convert an angle measure from radians to degrees.
     * Multiply a value in radians by this constant to convert to degrees.
     */
    public static RAD_TO_DEG:number = 57.295779513;

    /**
     * Pi &#42; 2.
     */
    public static TWO_PI:number = Math.PI + Math.PI;

    /**
     * Pi &#42; 0.5.
     */
    public static HALF_PI:number = Math.PI * 0.5;

    /**
     * Represents the smallest positive single value greater than zero.
     */
    public static EPSILON:number = 0.00001;

    constructor()
    {
    }

    /**
     * Convert an angle measure from radians to degrees.
     *
     * @param radians
     * @return The value, in degrees.
     *
     */
    public static toDegrees( radians:number ):number
    {
        return radians * 180 / Math.PI;
    }

    /**
     * Determines if a value is equal to or less than 0.00001.
     *
     * @return True, if equal to or less than 0.00001; false otherwise.
     */
    public static isNearZero( value:number ):boolean
    {
        return Math.abs( value ) <= LeapUtil.EPSILON;
    }

    /**
     * Determines if all Vector3 components is equal to or less than 0.00001.
     *
     * @return True, if equal to or less than 0.00001; false otherwise.
     */
    public static vectorIsNearZero( inVector:Vector3 ):boolean
    {
        return this.isNearZero( inVector.x ) && this.isNearZero( inVector.y ) && this.isNearZero( inVector.z );
    }

    /**
     * Create a new matrix with just the rotation block from the argument matrix
     */
    public static extractRotation( mtxTransform:Matrix ):Matrix
    {
        return new Matrix( mtxTransform.xBasis, mtxTransform.yBasis, mtxTransform.zBasis );
    }

    /**
     * Returns a matrix representing the inverse rotation by simple transposition of the rotation block.
     */
    public static rotationInverse( mtxRot:Matrix ):Matrix
    {
        return new Matrix( new Vector3( mtxRot.xBasis.x, mtxRot.yBasis.x, mtxRot.zBasis.x ), new Vector3( mtxRot.xBasis.y, mtxRot.yBasis.y, mtxRot.zBasis.y ), new Vector3( mtxRot.xBasis.z, mtxRot.yBasis.z, mtxRot.zBasis.z ) );
    }

    /**
     * Returns a matrix that is the orthonormal inverse of the argument matrix.
     * This is only valid if the input matrix is orthonormal
     * (the basis vectors are mutually perpendicular and of length 1)
     */
    public static rigidInverse( mtxTransform:Matrix ):Matrix
    {
        var rigidInverse:Matrix = this.rotationInverse( mtxTransform );
        rigidInverse.origin = rigidInverse.transformDirection( mtxTransform.origin.opposite() );
        return rigidInverse;
    }

    public static componentWiseMin( vLHS:Vector3, vRHS:Vector3 ):Vector3
    {
        return new Vector3( Math.min( vLHS.x, vRHS.x ), Math.min( vLHS.y, vRHS.y ), Math.min( vLHS.z, vRHS.z ) );
    }

    public static componentWiseMax( vLHS:Vector3, vRHS:Vector3 ):Vector3
    {
        return new Vector3( Math.max( vLHS.x, vRHS.x ), Math.max( vLHS.y, vRHS.y ), Math.max( vLHS.z, vRHS.z ) );
    }

    public static componentWiseScale( vLHS:Vector3, vRHS:Vector3 ):Vector3
    {
        return new Vector3( vLHS.x * vRHS.x, vLHS.y * vRHS.y, vLHS.z * vRHS.z );
    }

    public static componentWiseReciprocal( inVector:Vector3 ):Vector3
    {
        return new Vector3( 1.0 / inVector.x, 1.0 / inVector.y, 1.0 / inVector.z );
    }

    public static minComponent( inVector:Vector3 ):number
    {
        return Math.min( inVector.x, Math.min( inVector.y, inVector.z ) );
    }

    public static maxComponent( inVector:Vector3 ):number
    {
        return Math.max( inVector.x, Math.max( inVector.y, inVector.z ) );
    }

    /**
     * Compute the polar/spherical heading of a vector direction in z/x plane
     */
    public static heading( inVector:Vector3 ):number
    {
        return Math.atan2( inVector.z, inVector.x );
    }

    /**
     * Compute the spherical elevation of a vector direction in y above the z/x plane
     */
    public static elevation( inVector:Vector3 ):number
    {
        return Math.atan2( inVector.y, Math.sqrt( inVector.z * inVector.z + inVector.x * inVector.x ) );
    }

    /**
     * Set magnitude to 1 and bring heading to [-Pi,Pi], elevation into [-Pi/2, Pi/2]
     *
     * @param vSpherical The Vector3 to convert.
     * @return The normalized spherical Vector3.
     *
     */
    public static normalizeSpherical( vSpherical:Vector3 ):Vector3
    {
        var fHeading:number  = vSpherical.y;
        var fElevation:number = vSpherical.z;

        while ( fElevation <= -Math.PI ) fElevation += LeapUtil.TWO_PI;
        while ( fElevation > Math.PI ) fElevation -= LeapUtil.TWO_PI;

        if ( Math.abs( fElevation ) > LeapUtil.HALF_PI )
        {
            fHeading += Math.PI;
            fElevation = fElevation > 0 ? ( Math.PI - fElevation ) : -( Math.PI + fElevation );
        }

        while ( fHeading <= -Math.PI ) fHeading += LeapUtil.TWO_PI;
        while ( fHeading > Math.PI ) fHeading -= LeapUtil.TWO_PI;

        return new Vector3( 1, fHeading, fElevation );
    }

    /**
     * Convert from Cartesian (rectangular) coordinates to spherical coordinates
     * (magnitude, heading, elevation).
     *
     * @param vCartesian The Vector3 to convert.
     * @return The cartesian Vector3 converted to spherical.
     *
     */
    public static cartesianToSpherical( vCartesian:Vector3 ):Vector3
    {
        return new Vector3( vCartesian.magnitude(), this.heading( vCartesian ), this.elevation( vCartesian ) );
    }

    /**
     * Convert from spherical coordinates (magnitude, heading, elevation) to
     * Cartesian (rectangular) coordinates.
     *
     * @param vSpherical The Vector3 to convert.
     * @return The spherical Vector3 converted to cartesian.
     *
     */
    public static sphericalToCartesian( vSpherical:Vector3 ):Vector3
    {
        var fMagnitude:number    = vSpherical.x;
        var fCosHeading:number   = Math.cos( vSpherical.y );
        var fSinHeading:number   = Math.sin( vSpherical.y );
        var fCosElevation:number = Math.cos( vSpherical.z );
        var fSinElevation:number = Math.sin( vSpherical.z );

        return new Vector3(  fCosHeading   * fCosElevation  * fMagnitude,
            fSinElevation  * fMagnitude,
            fSinHeading   * fCosElevation  * fMagnitude);
    }

    /**
     * Clamps a value between a minimum Number and maximum Number value.
     *
     * @param inVal The number to clamp.
     * @param minVal The minimum value.
     * @param maxVal The maximum value.
     * @return The value clamped between minVal and maxVal.
     *
     */
    public static clamp( inVal:number, minVal:number, maxVal:number ):number
    {
        return ( inVal < minVal ) ? minVal : (( inVal > maxVal ) ? maxVal : inVal );
    }

    /**
     * Linearly interpolates between two Numbers.
     *
     * @param a A number.
     * @param b A number.
     * @param coefficient The interpolation coefficient [0-1].
     * @return The interpolated number.
     *
     */
    public static lerp( a:number, b:number, coefficient:number ):number
    {
        return a + ( ( b - a ) * coefficient );
    }

    /**
     * Linearly interpolates between two Vector3 objects.
     *
     * @param vec1 A Vector3 object.
     * @param vec2 A Vector3 object.
     * @param coefficient The interpolation coefficient [0-1].
     * @return A new interpolated Vector3 object.
     *
     */
    public static lerpVector( vec1:Vector3, vec2:Vector3, coefficient:number ):Vector3
    {
        return vec1.plus( vec2.minus( vec1 ).multiply( coefficient ) );
    }
}







/**
 * The Controller export class is your main export interface to the Leap Motion Controller.
 *
 * <p>Create an instance of this Controller export class to access frames of tracking
 * data and configuration information. Frame data can be polled at any time using
 * the <code>Controller::frame()</code> . Call <code>frame()</code> or <code>frame(0)</code>
 * to get the most recent frame. Set the history parameter to a positive integer
 * to access previous frames. A controller stores up to 60 frames in its frame history.</p>
 *
 * <p>Polling is an appropriate strategy for applications which already have an
 * intrinsic update loop, such as a game. You can also implement the Leap::Listener
 * export interface to handle events as they occur. The Leap dispatches events to the listener
 * upon initialization and exiting, on connection changes, and when a new frame
 * of tracking data is available. When these events occur, the controller object
 * invokes the appropriate callback defined in the Listener interface.</p>
 *
 * <p>To access frames of tracking data as they become available:</p>
 *
 * <ul>
 * <li>Implement the Listener export interface and override the <code>Listener::onFrame()</code> .</li>
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
     * @private
     * The Listener subexport class instance.
     */
    private listener:Listener;

    /**
     * @private
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
     * @private
     * Reports whether this Controller is connected to the Leap Motion Controller.
     */
    public _isConnected:boolean = false;

    /**
     * @private
     * Reports whether gestures is enabled.
     */
    public _isGesturesEnabled:boolean = false;

    /**
     * Constructs a Controller object.
     * @param host IP or hostname of the computer running the Leap software.
     * (currently only supported for socket connections).
     *
     */
    constructor( host:string = null )
    {
        super();

        this.listener = new DefaultListener();

        if( !host )
        {
            this.connection = new WebSocket("ws://localhost:6437");
        }
        else
        {
            this.connection = new WebSocket("ws://" + host + ":6437");
        }

        this.listener.onInit( this );

        this.connection.onopen = ( event:Event ) =>
        {
            this._isConnected = true;
            this.listener.onConnect( this );
        };

        this.connection.onclose = ( data:Object ) =>
        {
            this._isConnected = false;
            this.listener.onDisconnect( this );
        };

        this.connection.onmessage = ( data:Object ) =>
        {
            var i:number;
            var json:Object;
            var currentFrame:Frame;
            var hand:Hand;
            var pointable:Pointable;
            var gesture:Gesture;
            var isTool:boolean;
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
                for ( i = 0; i < length; i++ )
                {
                    hand = new Hand();
                    hand.frame = currentFrame;
                    hand.direction = new Vector3( json["hands"][ i ].direction[ 0 ], json["hands"][ i ].direction[ 1 ], json["hands"][ i ].direction[ 2 ] );
                    hand.id = json["hands"][ i ].id;
                    hand.palmNormal = new Vector3( json["hands"][ i ].palmNormal[ 0 ], json["hands"][ i ].palmNormal[ 1 ], json["hands"][ i ].palmNormal[ 2 ] );
                    hand.palmPosition = new Vector3( json["hands"][ i ].palmPosition[ 0 ], json["hands"][ i ].palmPosition[ 1 ], json["hands"][ i ].palmPosition[ 2 ] );
                    hand.palmVelocity = new Vector3( json["hands"][ i ].palmPosition[ 0 ], json["hands"][ i ].palmPosition[ 1 ], json["hands"][ i ].palmPosition[ 2 ] );
                    hand.rotation = new Matrix( new Vector3( json["hands"][ i ]["r"][ 0 ][ 0 ], json["hands"][ i ]["r"][ 0 ][ 1 ], json["hands"][ i ]["r"][ 0 ][ 2 ] ), new Vector3( json["hands"][ i ]["r"][ 1 ][ 0 ], json["hands"][ i ]["r"][ 1 ][ 1 ], json["hands"][ i ]["r"][ 1 ][ 2 ] ), new Vector3( json["hands"][ i ]["r"][ 2 ][ 0 ], json["hands"][ i ]["r"][ 2 ][ 1 ], json["hands"][ i ]["r"][ 2 ][ 2 ] ) );
                    hand.scaleFactorNumber = json["hands"][ i ]["s"];
                    hand.sphereCenter = new Vector3( json["hands"][ i ].sphereCenter[ 0 ], json["hands"][ i ].sphereCenter[ 1 ], json["hands"][ i ].sphereCenter[ 2 ] );
                    hand.sphereRadius = json["hands"][ i ].sphereRadius;
                    hand.translationVector = new Vector3( json["hands"][ i ]["t"][ 0 ], json["hands"][ i ]["t"][ 1 ], json["hands"][ i ]["t"][ 2 ] );
                    currentFrame.hands.push( hand );
                }
            }

            // ID
            currentFrame.id = json["id"];

            // InteractionBox
            if ( !(typeof json["interactionBox"] === "undefined") )
            {
                currentFrame.interactionBox = new InteractionBox();
                currentFrame.interactionBox.center = new Vector3( json["interactionBox"].center[ 0 ], json["interactionBox"].center[ 1 ], json["interactionBox"].center[ 2 ] );
                currentFrame.interactionBox.width = json["interactionBox"].size[ 0 ];
                currentFrame.interactionBox.height = json["interactionBox"].size[ 1 ];
                currentFrame.interactionBox.depth = json["interactionBox"].size[ 2 ];
            }

            // Pointables
            if ( !(typeof json["pointables"] === "undefined") )
            {
                i = 0;
                length = json["pointables"].length;
                for ( i = 0; i < length; i++ )
                {
                    isTool = json["pointables"][ i ].tool;
                    if ( isTool )
                        pointable = new Tool();
                    else
                        pointable = new Finger();

                    pointable.frame = currentFrame;
                    pointable.id = json["pointables"][ i ].id;
                    pointable.hand = Controller.getHandByID( currentFrame, json["pointables"][ i ]["handId"] );
                    pointable.length = json["pointables"][ i ].length;
                    pointable.direction = new Vector3( json["pointables"][ i ].direction[ 0 ], json["pointables"][ i ].direction[ 1 ], json["pointables"][ i ].direction[ 2 ] );
                    pointable.tipPosition = new Vector3( json["pointables"][ i ].tipPosition[ 0 ], json["pointables"][ i ].tipPosition[ 1 ], json["pointables"][ i ].tipPosition[ 2 ] );
                    pointable.stabilizedTipPosition = new Vector3( json["pointables"][ i ].stabilizedTipPosition[ 0 ], json["pointables"][ i ].stabilizedTipPosition[ 1 ], json["pointables"][ i ].stabilizedTipPosition[ 2 ] );
                    pointable.tipVelocity = new Vector3( json["pointables"][ i ].tipVelocity[ 0 ], json["pointables"][ i ].tipVelocity[ 1 ], json["pointables"][ i ].tipVelocity[ 2 ] );
                    pointable.touchDistance = json["pointables"][ i ].touchDist;
                    currentFrame.pointables.push( pointable );

                    switch( json["pointables"][ i ].touchZone )
                    {
                        case "hovering":
                            pointable.touchZone = Zone.ZONE_HOVERING;
                            break;
                        case "touching":
                            pointable.touchZone = Zone.ZONE_TOUCHING;
                            break;
                        default:
                            pointable.touchZone = Zone.ZONE_NONE;
                            break;
                    }

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
                for ( i = 0; i < length; i++ )
                {
                    switch( json["gestures"][ i ].type )
                    {
                        case "circle":
                            gesture = new CircleGesture();
                            type = Type.TYPE_CIRCLE;
                            var circle:CircleGesture = <CircleGesture>gesture;

                            circle.center = new Vector3( json["gestures"][ i ].center[ 0 ], json["gestures"][ i ].center[ 1 ], json["gestures"][ i ].center[ 2 ] );
                            circle.normal = new Vector3( json["gestures"][ i ].normal[ 0 ], json["gestures"][ i ].normal[ 1 ], json["gestures"][ i ].normal[ 2 ] );
                            circle.progress = json["gestures"][ i ].progress;
                            circle.radius = json["gestures"][ i ].radius;
                            break;

                        case "swipe":
                            gesture = new SwipeGesture();
                            type = Type.TYPE_SWIPE;

                            var swipe:SwipeGesture = <SwipeGesture>gesture;

                            swipe.startPosition = new Vector3( json["gestures"][ i ].startPosition[ 0 ], json["gestures"][ i ].startPosition[ 1 ], json["gestures"][ i ].startPosition[ 2 ] );
                            swipe.position = new Vector3( json["gestures"][ i ].position[ 0 ], json["gestures"][ i ].position[ 1 ], json["gestures"][ i ].position[ 2 ] );
                            swipe.direction = new Vector3( json["gestures"][ i ].direction[ 0 ], json["gestures"][ i ].direction[ 1 ], json["gestures"][ i ].direction[ 2 ] );
                            swipe.speed = json["gestures"][ i ].speed;
                            break;

                        case "screenTap":
                            gesture = new ScreenTapGesture();
                            type = Type.TYPE_SCREEN_TAP;

                            var screenTap:ScreenTapGesture = <ScreenTapGesture>gesture;
                            screenTap.position = new Vector3( json["gestures"][ i ].position[ 0 ], json["gestures"][ i ].position[ 1 ], json["gestures"][ i ].position[ 2 ] );
                            screenTap.direction = new Vector3( json["gestures"][ i ].direction[ 0 ], json["gestures"][ i ].direction[ 1 ], json["gestures"][ i ].direction[ 2 ] );
                            screenTap.progress = json["gestures"][ i ].progress;
                            break;

                        case "keyTap":
                            gesture = new KeyTapGesture();
                            type = Type.TYPE_KEY_TAP;

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

                    if( !(typeof json["gestures"][ i ]["handIds"] === "undefined") )
                    {
                        j = 0;
                        lengthInner = json["gestures"][ i ]["handIds"].length;
                        for( j = 0; j < lengthInner; ++j )
                        {
                            var gestureHand:Hand = Controller.getHandByID( currentFrame, json["gestures"][ i ]["handIds"][ j ] );
                            gesture.hands.push( gestureHand );
                        }
                    }

                    if( !(typeof json["gestures"][ i ]["pointableIds"] === "undefined") )
                    {
                        j = 0;
                        lengthInner = json["gestures"][ i ]["pointableIds"].length;
                        for( j = 0; j < lengthInner; ++j )
                        {
                            var gesturePointable:Pointable = Controller.getPointableByID( currentFrame, json["gestures"][ i ]["pointableIds"][ j ] );
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
                            gesture.state = State.STATE_START;
                            break;
                        case "update":
                            gesture.state = State.STATE_UPDATE;
                            break;
                        case "stop":
                            gesture.state = State.STATE_STOP;
                            break;
                        default:
                            gesture.state = State.STATE_INVALID;
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
            this.listener.onFrame( this, this.latestFrame );
        };
    }

    /**
     * Finds a Hand object by ID.
     *
     * @param frame The Frame object in which the Hand contains
     * @param id The ID of the Hand object
     * @return The Hand object if found, otherwise null
     *
     */
    private static getHandByID( frame:Frame, id:number ):Hand
    {
        var returnValue:Hand = null;
        var i:number = 0;

        for( i = 0; i < frame.hands.length; i++ )
        {
            if ( (<Hand>frame.hands[ i ]).id === id )
            {
                returnValue = (<Hand>frame.hands[ i ]);
                break;
            }
        }
        return returnValue;
    }

    /**
     * Finds a Pointable object by ID.
     *
     * @param frame The Frame object in which the Pointable contains
     * @param id The ID of the Pointable object
     * @return The Pointable object if found, otherwise null
     *
     */
    private static getPointableByID( frame:Frame, id:number ):Pointable
    {
        var returnValue:Pointable = null;
        var i:number = 0;

        for( i = 0; i < frame.pointables.length; i++ )
        {
            if ( (<Pointable>frame.pointables[ i ]).id === id )
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
    public frame( history:number = 0 ):Frame
    {
        if( history >= this.frameHistory.length )
            return Frame.invalid();
        else
            return this.frameHistory[ history ];
    }

    /**
     * Update the object that receives direct updates from the Leap Motion Controller.
     *
     * <p>The default listener will make the controller dispatch flash events.
     * You can override this behaviour, by implementing the IListener interface
     * in your own classes, and use this method to set the listener to your
     * own implementation.</p>
     *
     * @param listener
     */
    public setListener( listener:Listener ):void
    {
        this.listener = listener;
    }

    /**
     * Enables or disables reporting of a specified gesture type.
     *
     * <p>By default, all gesture types are disabled. When disabled, gestures of
     * the disabled type are never reported and will not appear in the frame
     * gesture list.</p>
     *
     * <p>As a performance optimization, only enable recognition for the types
     * of movements that you use in your application.</p>
     *
     * @param type The type of gesture to enable or disable. Must be a member of the Gesture::Type enumeration.
     * @param enable True, to enable the specified gesture type; False, to disable.
     *
     */
    public enableGesture( type:number, enable:boolean = true ):void
    {
        var enableObject:Object = {};

        if( enable )
        {
            this._isGesturesEnabled = true;
            enableObject["enableGestures"] = true;
        }
        else
        {
            this._isGesturesEnabled = false;
            enableObject["enableGestures"] = false;
        }

        this.connection.send( JSON.stringify( enableObject ) );
    }

    /**
     * Reports whether the specified gesture type is enabled.
     *
     * @param type The Gesture.TYPE parameter.
     * @return True, if the specified type is enabled; false, otherwise.
     *
     */
    public isGestureEnabled( type:number ):boolean
    {
        return this._isGesturesEnabled;
    }

    /**
     * Reports whether this Controller is connected to the Leap Motion Controller.
     *
     * <p>When you first create a Controller object, <code>isConnected()</code> returns false.
     * After the controller finishes initializing and connects to
     * the Leap, <code>isConnected()</code> will return true.</p>
     *
     * <p>You can either handle the onConnect event using a event listener
     * or poll the <code>isConnected()</code> if you need to wait for your
     * application to be connected to the Leap before performing
     * some other operation.</p>
     *
     * @return True, if connected; false otherwise.
     *
     */
    public isConnected():boolean
    {
        return this._isConnected;
    }
}
/**
 * The InteractionBox export class represents a box-shaped region completely within
 * the field of view of the Leap Motion controller.
 *
 * <p>The interaction box is an axis-aligned rectangular prism and provides
 * normalized coordinates for hands, fingers, and tools within this box.
 * The InteractionBox export class can make it easier to map positions in the
 * Leap Motion coordinate system to 2D or 3D coordinate systems used
 * for application drawing.</p>
 *
 * <p>The InteractionBox region is defined by a center and dimensions along the x, y, and z axes.</p>
 *
 * @author logotype
 *
 */
export class InteractionBox
{
    /**
     * The center of the InteractionBox in device coordinates (millimeters).
     * <p>This point is equidistant from all sides of the box.</p> 
     */
    public center:Vector3;
    
    /**
     * The depth of the InteractionBox in millimeters, measured along the z-axis. 
     * 
     */
    public depth:number;
    
    /**
     * The height of the InteractionBox in millimeters, measured along the y-axis. 
     * 
     */
    public height:number;
    
    /**
     * The width of the InteractionBox in millimeters, measured along the x-axis. 
     * 
     */
    public width:number;

    constructor()
    {
    }

    /**
     * Converts a position defined by normalized InteractionBox coordinates
     * into device coordinates in millimeters.
     * 
     * This function performs the inverse of normalizePoint().
     *  
     * @param normalizedPosition The input position in InteractionBox coordinates.
     * @return The corresponding denormalized position in device coordinates.
     * 
     */
    public denormalizePoint( normalizedPosition:Vector3 ):Vector3
    {
        var vec:Vector3 = Vector3.invalid();

        vec.x = ( ( ( normalizedPosition.x + this.center.x ) - 0.5 ) * this.width );
        vec.y = ( ( ( normalizedPosition.y + this.center.y ) - 0.5 ) * this.height );
        vec.z = ( ( ( normalizedPosition.z + this.center.z ) - 0.5 ) * this.depth );

        return vec;
    }
    
    /**
     * Normalizes the coordinates of a point using the interaction box.
     * 
     * <p>Coordinates from the Leap Motion frame of reference (millimeters) are
     * converted to a range of [0..1] such that the minimum value of the
     * InteractionBox maps to 0 and the maximum value of the InteractionBox maps to 1.</p>
     *  
     * @param position The input position in device coordinates.
     * @param clamp Whether or not to limit the output value to the range [0,1]
     * when the input position is outside the InteractionBox. Defaults to true.
     * @return The normalized position.
     * 
     */
    public normalizePoint( position:Vector3, clamp:boolean = true ):Vector3
    {
        var vec:Vector3 = Vector3.invalid();

        vec.x = ( ( position.x - this.center.x ) / this.width ) + 0.5;
        vec.y = ( ( position.y - this.center.y ) / this.height ) + 0.5;
        vec.z = ( ( position.z - this.center.z ) / this.depth ) + 0.5;

        if( clamp )
        {
            vec.x = Math.min( Math.max( vec.x, 0 ), 1 );
            vec.y = Math.min( Math.max( vec.y, 0 ), 1 );
            vec.z = Math.min( Math.max( vec.z, 0 ), 1 );
        }

        return vec;
    }
    
    /**
     * Reports whether this is a valid InteractionBox object. 
     * @return True, if this InteractionBox object contains valid data.
     * 
     */
    public isValid():boolean
    {
        return this.center.isValid() && this.width > 0 && this.height > 0 && this.depth > 0;
    }
    
    /**
     * Compare InteractionBox object equality/inequality.
     * 
     * <p>Two InteractionBox objects are equal if and only if both InteractionBox
     * objects represent the exact same InteractionBox and both InteractionBoxes are valid.</p>
     *  
     * @param other
     * @return 
     * 
     */
    public isEqualTo( other:InteractionBox ):boolean
    {
        if( !this.isValid() || !other.isValid() )
            return false;

        if( !this.center.isEqualTo( other.center ) )
            return false;
        
        if( this.depth != other.depth )
            return false;
        
        if( this.height != other.height )
            return false;
        
        if( this.width != other.width )
            return false;
        
        return true;
    }
    
    /**
     * Returns an invalid InteractionBox object.
     *
     * <p>You can use the instance returned by this function in comparisons
     * testing whether a given InteractionBox instance is valid or invalid.
     * (You can also use the <code>InteractionBox.isValid()</code> function.)</p>
     *
     * @return The invalid InteractionBox instance.
     *
     */
    public static invalid():InteractionBox
    {
        return new InteractionBox();
    }

    /**
     * Writes a brief, human readable description of the InteractionBox object.
     * @return A description of the InteractionBox as a string.
     *
     */
    public toString():string
    {
        return "[InteractionBox depth:" + this.depth + " height:" + this.height + " width:" + this.width + "]";
    }
}


/**
 * The Pointable export class reports the physical characteristics of a detected finger or tool.
 * Both fingers and tools are classified as Pointable objects. Use the Pointable.isFinger
 * property to determine whether a Pointable object represents a finger. Use the
 * Pointable.isTool property to determine whether a Pointable object represents a tool.
 * The Leap classifies a detected entity as a tool when it is thinner, straighter,
 * and longer than a typical finger.
 *
 * <p>Note that Pointable objects can be invalid, which means that they do not contain valid
 * tracking data and do not correspond to a physical entity. Invalid Pointable objects
 * can be the result of asking for a Pointable object using an ID from an earlier frame
 * when no Pointable objects with that ID exist in the current frame. A Pointable object
 * created from the Pointable constructor is also invalid. Test for validity with
 * the <code>Pointable.isValid()</code> function.</p>
 *
 * @author logotype
 *
 */

/**
 * Defines the values for reporting the state of a Pointable object in relation to an adaptive touch plane.
 */
enum Zone {
    /**
     * The Pointable object is too far from the plane to be considered hovering or touching.
     *
     * <p>Defines the values for reporting the state of a Pointable object in relation to an adaptive touch plane.</p>
     */
    ZONE_NONE = 0,

    /**
     * The Pointable object is close to, but not touching the plane.
     *
     * <p>Defines the values for reporting the state of a Pointable object in relation to an adaptive touch plane.</p>
     */
    ZONE_HOVERING = 1,

    /**
     * The Pointable has penetrated the plane.
     *
     * <p>Defines the values for reporting the state of a Pointable object in relation to an adaptive touch plane.</p>
     */
    ZONE_TOUCHING = 2
}

export class Pointable
{
    /**
     * The current touch zone of this Pointable object.
     *
     * <p>The Leap Motion software computes the touch zone based on a
     * floating touch plane that adapts to the user's finger movement
     * and hand posture. The Leap Motion software interprets purposeful
     * movements toward this plane as potential touch points.
     * When a Pointable moves close to the adaptive touch plane,
     * it enters the "hovering" zone. When a Pointable reaches or
     * passes through the plane, it enters the "touching" zone.</p>
     *
     * <p>The possible states are present in the Zone enum of this class:</p>
     *
     * <code>Zone.NONE – The Pointable is outside the hovering zone.
     * Zone.HOVERING – The Pointable is close to, but not touching the touch plane.
     * Zone.TOUCHING – The Pointable has penetrated the touch plane.</code>
     *
     * <p>The touchDistance value provides a normalized indication of the
     * distance to the touch plane when the Pointable is in the hovering
     * or touching zones.</p>
     *
     */
    public touchZone:number = Zone.ZONE_NONE;

    /**
     * A value proportional to the distance between this Pointable
     * object and the adaptive touch plane.
     *
     * <p>The touch distance is a value in the range [-1, 1].
     * The value 1.0 indicates the Pointable is at the far edge of
     * the hovering zone. The value 0 indicates the Pointable is
     * just entering the touching zone. A value of -1.0 indicates
     * the Pointable is firmly within the touching zone.
     * Values in between are proportional to the distance from the plane.
     * Thus, the touchDistance of 0.5 indicates that the Pointable
     * is halfway into the hovering zone.</p>
     *
     * <p>You can use the touchDistance value to modulate visual
     * feedback given to the user as their fingers close in on a
     * touch target, such as a button.</p>
     *
     */
    public touchDistance:number = 0;

    /**
     * The direction in which this finger or tool is pointing.<br/>
     * The direction is expressed as a unit vector pointing in the
     * same direction as the tip.
     */
    public direction:Vector3;

    /**
     * The Frame associated with this Pointable object.<br/>
     * The associated Frame object, if available; otherwise, an invalid
     * Frame object is returned.
     * @see Frame
     */
    public frame:Frame;

    /**
     * The Hand associated with this finger or tool.<br/>
     * The associated Hand object, if available; otherwise, an invalid
     * Hand object is returned.
     * @see Hand
     */
    public hand:Hand;

    /**
     * A unique ID assigned to this Pointable object, whose value remains
     * the same across consecutive frames while the tracked finger or
     * tool remains visible.
     *
     * <p>If tracking is lost (for example, when a finger is occluded by another
     * finger or when it is withdrawn from the Leap field of view), the Leap
     * may assign a new ID when it detects the entity in a future frame.</p>
     *
     * <p>Use the ID value with the <code>Frame.pointable()</code> to find this
     * Pointable object in future frames.</p>
     */
    public id:number;

    /**
     * The estimated length of the finger or tool in millimeters.
     *
     * <p>The reported length is the visible length of the finger or tool from
     * the hand to tip.</p>
     *
     * <p>If the length isn't known, then a value of 0 is returned.</p>
     */
    public length:number = 0;

    /**
     * The estimated width of the finger or tool in millimeters.
     *
     * <p>The reported width is the average width of the visible portion
     * of the finger or tool from the hand to the tip.</p>
     *
     * <p>If the width isn't known, then a value of 0 is returned.</p>
     */
    public width:number = 0;

    /**
     * The tip position in millimeters from the Leap origin.
     */
    public tipPosition:Vector3;

    /**
     * The stabilized tip position of this Pointable.
     * <p>Smoothing and stabilization is performed in order to make this value more suitable for interaction with 2D content.</p>
     * <p>A modified tip position of this Pointable object with some additional smoothing and stabilization applied.</p> 
     */
    public stabilizedTipPosition:Vector3;

    /**
     * The rate of change of the tip position in millimeters/second.
     */
    public tipVelocity:Vector3;

    /**
     * Whether or not the Pointable is believed to be a finger.
     */
    public isFinger:boolean;

    /**
     * Whether or not the Pointable is believed to be a tool.
     */
    public isTool:boolean;

    constructor()
    {
        this.direction = Vector3.invalid();
        this.tipPosition = Vector3.invalid();
        this.tipVelocity = Vector3.invalid();
    }

    /**
     * Reports whether this is a valid Pointable object.
     * @return True if <code>direction</code>, <code>tipPosition</code> and <code>tipVelocity</code> are true.
     */
    public isValid():boolean
    {
        var returnValue:boolean = false;

        if ( ( this.direction && this.direction.isValid()) && ( this.tipPosition && this.tipPosition.isValid()) && ( this.tipVelocity && this.tipVelocity.isValid()) )
            returnValue = true;

        return returnValue;
    }

    /**
     * Compare Pointable object equality/inequality.
     *
     * <p>Two Pointable objects are equal if and only if both Pointable
     * objects represent the exact same physical entities in
     * the same frame and both Pointable objects are valid.</p>
     *
     * @param other The Pointable to compare with.
     * @return True; if equal, False otherwise.
     *
     */
    public isEqualTo( other:Pointable ):boolean
    {
        if ( !this.isValid() || !other.isValid() )
            return false;

        if ( this.frame != other.frame )
            return false;

        if ( this.hand != other.hand )
            return false;

        if ( !this.direction.isEqualTo( other.direction ) )
            return false;

        if ( this.length != other.length )
            return false;

        if ( this.width != other.width )
            return false;

        if ( this.id != other.id )
            return false;

        if ( !this.tipPosition.isEqualTo( other.tipPosition ) )
            return false;

        if ( !this.tipVelocity.isEqualTo( other.tipVelocity ) )
            return false;

        if ( this.isFinger != other.isFinger || this.isTool != other.isTool )
            return false;

        return true;
    }

    /**
     * Returns an invalid Pointable object.
     *
     * <p>You can use the instance returned by this in
     * comparisons testing whether a given Pointable instance
     * is valid or invalid.<br/>
     * (You can also use the <code>Pointable.isValid()</code> function.)</p>
     *
     * @return The invalid Pointable instance.
     *
     */
    public static invalid():Pointable
    {
        return new Pointable();
    }

    /**
     * A string containing a brief, human readable description of the Pointable object.
     */
    public toString():string
    {
        return "[Pointable direction: " + this.direction + " tipPosition: " + this.tipPosition + " tipVelocity: " + this.tipVelocity + "]";
    }
}


/**
 * The Gesture export class represents a recognized movement by the user.
 *
 * <p>The Leap watches the activity within its field of view for certain movement
 * patterns typical of a user gesture or command. For example, a movement from
 * side to side with the hand can indicate a swipe gesture, while a finger poking
 * forward can indicate a screen tap gesture.</p>
 *
 * <p>When the Leap recognizes a gesture, it assigns an ID and adds a Gesture object
 * to the frame gesture list. For continuous gestures, which occur over many frames,
 * the Leap updates the gesture by adding a Gesture object having the same ID and
 * updated properties in each subsequent frame.</p>
 *
 * <p><strong>Important: Recognition for each type of gesture must be enabled using the
 * <code>Controller.enableGesture()</code> function; otherwise no gestures are recognized
 * or reported.</strong></p>
 *
 * <p>Subclasses of Gesture define the properties for the specific movement
 * patterns recognized by the Leap.</p>
 *
 * <p>The Gesture subclasses for include:
 * <pre>
 * CircleGesture – A circular movement by a finger.
 * SwipeGesture – A straight line movement by the hand with fingers extended.
 * ScreenTapGesture – A forward tapping movement by a finger.
 * KeyTapGesture – A downward tapping movement by a finger.
 * </pre>
 * </p>
 *
 * <p>Circle and swipe gestures are continuous and these objects can have a state
 * of start, update, and stop.</p>
 *
 * <p>The screen tap gesture is a discrete gesture. The Leap only creates a single
 * ScreenTapGesture object appears for each tap and it always has a stop state.</p>
 *
 * <p>Get valid Gesture instances from a Frame object. You can get a list of gestures
 * with the <code>Frame.gestures()</code> method. You can get a list of gestures since a specified
 * frame with the <code>Frame.gestures(frame)</code> methods. You can also use the <code>Frame.gesture()</code>
 * method to find a gesture in the current frame using an ID value obtained
 * in a previous frame.</p>
 *
 * <p>Gesture objects can be invalid. For example, when you get a gesture by ID using
 * <code>Frame.gesture()</code>, and there is no gesture with that ID in the current frame, then
 * <code>gesture()</code> returns an Invalid Gesture object (rather than a null value).
 * Always check object validity in situations where a gesture might be invalid.</p>
 *
 * <p>The following keys can be used with the Config export class to configure the gesture recognizer:</p>
 *
 * <table class="innertable">
 *   <tr>
 *    <th>Key string</th>
 *    <th>Value type</th>
 *    <th>Default value</th>
 *    <th>Units</th>
 *  </tr>
 *   <tr>
 *    <td>Gesture.Circle.MinRadius</td>
 *    <td>float</td>
 *    <td>5.0</td>
 *    <td>mm</td>
 *  </tr>
 *   <tr>
 *    <td>Gesture.Circle.MinArc</td>
 *    <td>float</td>
 *    <td>1.5&#42;pi</td>
 *    <td>radians</td>
 *  </tr>
 *   <tr>
 *    <td>Gesture.Swipe.MinLength</td>
 *    <td>float</td>
 *    <td>150</td>
 *    <td>mm</td>
 *  </tr>
 *   <tr>
 *    <td>Gesture.Swipe.MinVelocity</td>
 *    <td>float</td>
 *    <td>1000</td>
 *    <td>mm/s</td>
 *  </tr>
 *   <tr>
 *    <td>Gesture.KeyTap.MinDownVelocity</td>
 *    <td>float</td>
 *    <td>50</td>
 *    <td>mm/s</td>
 *  </tr>
 *   <tr>
 *    <td>Gesture.KeyTap.HistorySeconds</td>
 *    <td>float</td>
 *    <td>0.1</td>
 *    <td>s</td>
 *  </tr>
 *   <tr>
 *    <td>Gesture.KeyTap.MinDistance</td>
 *    <td>float</td>
 *    <td>5.0</td>
 *    <td>mm</td>
 *  </tr>
 *   <tr>
 *    <td>Gesture.ScreenTap.MinForwardVelocity</td>
 *    <td>float</td>
 *    <td>50</td>
 *    <td>mm/s</td>
 *  </tr>
 *   <tr>
 *    <td>Gesture.ScreenTap.HistorySeconds</td>
 *    <td>float</td>
 *    <td>0.1</td>
 *    <td>s</td>
 *  </tr>
 *   <tr>
 *    <td>Gesture.ScreenTap.MinDistance</td>
 *    <td>float</td>
 *    <td>3.0</td>
 *    <td>mm</td>
 *  </tr>
 * </table>
 *
 * @author logotype
 * @see CircleGesture
 * @see SwipeGesture
 * @see ScreenTapGesture
 * @see KeyTapGesture
 * @see Config
 *
 */

/**
 * The possible gesture states.
 */
enum State {
    /**
     * An invalid state.
     */
    STATE_INVALID = 0,

    /**
     * The gesture is starting.<br/>
     * Just enough has happened to recognize it.
     */
    STATE_START = 1,

    /**
     * The gesture is in progress.<br/>
     * (Note: not all gestures have updates).
     */
    STATE_UPDATE = 2,

    /**
     * The gesture has completed or stopped.
     */
    STATE_STOP = 3
}

/**
 * The supported types of gestures.
 */
enum Type {
    /**
     * An invalid type.
     */
    TYPE_INVALID = 4,

    /**
     * A straight line movement by the hand with fingers extended.
     */
    TYPE_SWIPE = 5,

    /**
     * A circular movement by a finger.
     */
    TYPE_CIRCLE = 6,

    /**
     * A forward tapping movement by a finger.
     */
    TYPE_SCREEN_TAP = 7,

    /**
     * A downward tapping movement by a finger.
     */
    TYPE_KEY_TAP = 8
}
export class Gesture
{
    /**
     * The elapsed duration of the recognized movement up to the frame
     * containing this Gesture object, in microseconds.
     *
     * <p>The duration reported for the first Gesture in the sequence (with
     * the <code>STATE_START</code> state) will typically be a small positive number
     * since the movement must progress far enough for the Leap to recognize
     * it as an intentional gesture.</p>
     */
    public duration:number;

    /**
     * The elapsed duration in seconds.
     */
    public durationSeconds:number;

    /**
     * The Frame containing this Gesture instance.
     */
    public frame:Frame;

    /**
     * The list of hands associated with this Gesture, if any.
     *
     * <p>If no hands are related to this gesture, the list is empty.</p>
     */
    public hands:Hand[] = [];

    /**
     * The gesture ID.
     *
     * <p>All Gesture objects belonging to the same recognized movement share
     * the same ID value. Use the ID value with the Frame.gesture() method
     * to find updates related to this Gesture object in subsequent frames.</p>
     */
    public id:number;

    /**
     * The list of fingers and tools associated with this Gesture, if any.
     *
     * <p>If no Pointable objects are related to this gesture, the list is empty.</p>
     */
    public pointables:Pointable[] = [];

    /**
     * The gesture state.
     *
     * <p>Recognized movements occur over time and have a beginning, a middle,
     * and an end. The <code>state</code> attribute reports where in that sequence
     * this Gesture object falls.</p>
     */
    public state:number;

    /**
     * The gesture type.
     */
    public type:number;

    /**
     * Constructs a new Gesture object.
     *
     * <p>An uninitialized Gesture object is considered invalid. Get valid
     * instances of the Gesture class, which will be one of the Gesture
     * subclasses, from a Frame object.</p>
     *
     */
    constructor()
    {
    }

    /**
     * Compare Gesture object equality/inequality.
     *
     * <p>Two Gestures are equal if they represent the same snapshot of
     * the same recognized movement.</p>
     *
     * @param other The Gesture to compare with.
     * @return True; if equal, False otherwise.
     *
     */
    public isEqualTo( other:Gesture ):boolean
    {
        return (this.id == other.id);
    }

    /**
     * Reports whether this Gesture instance represents a valid Gesture.
     *
     * <p>An invalid Gesture object does not represent a snapshot of a recognized
     * movement. Invalid Gesture objects are returned when a valid object
     * cannot be provided. For example, when you get an gesture by ID using
     * Frame.gesture(), and there is no gesture with that ID in the current
     * frame, then gesture() returns an Invalid Gesture object (rather than
     * a null value). Always check object validity in situations where an
     * gesture might be invalid.</p>
     *
     * @return True, if this is a valid Gesture instance; false, otherwise.
     *
     */
    public isValid():boolean
    {
        if( !this.durationSeconds )
            return false;

        return true;
    }

    /**
     * Returns an invalid Gesture object.
     *
     * <p>You can use the instance returned by this in comparisons
     * testing whether a given Gesture instance is valid or invalid.
     * (You can also use the <code>Gesture.isValid()</code> function.)</p>
     *
     * @return The invalid Gesture instance.
     *
     */
    public static invalid():Gesture
    {
        return new Gesture();
    }

    /**
     * A string containing a brief, human-readable description of this Gesture.
     *
     */
    public toString():string
    {
        return "[Gesture id:" + this.id + " duration:" + this.duration + " type:" + this.type + "]";
    }
}
/**
 * The Finger export class represents a tracked finger.
 *
 * <p>Fingers are Pointable objects that the Leap has classified as a finger.
 * Get valid Finger objects from a Frame or a Hand object.</p>
 *
 * <p>Note that Finger objects can be invalid, which means that they do not
 * contain valid tracking data and do not correspond to a physical finger.
 * Invalid Finger objects can be the result of asking for a Finger object
 * using an ID from an earlier frame when no Finger objects with that ID
 * exist in the current frame. A Finger object created from the Finger
 * constructor is also invalid.<br/>
 * Test for validity with the <code>Finger.sValid()</code> function.</p>
 *
 * @author logotype
 *
 */
export class Finger extends Pointable
{
    /**
     * Constructs a Finger object.
     *
     * <p>An uninitialized finger is considered invalid.
     * Get valid Finger objects from a Frame or a Hand object.</p>
     *
     */
    constructor()
    {
        super();
        this.isFinger = true;
        this.isTool = false;
    }

    /**
     * Returns an invalid Finger object.
     *
     * <p>You can use the instance returned by this function in
     * comparisons testing whether a given Finger instance
     * is valid or invalid.
     * (You can also use the <code>Finger.isValid()</code> function.)</p>
     *
     * @return The invalid Finger instance.
     *
     */
    public static invalid():Finger
    {
        return new Finger();
    }
}
/**
 * The Tool export class represents a tracked tool.
 *
 * <p>Tools are Pointable objects that the Leap has classified as a tool.
 * Tools are longer, thinner, and straighter than a typical finger.
 * Get valid Tool objects from a Frame or a Hand object.</p>
 *
 * <p>Note that Tool objects can be invalid, which means that they do not
 * contain valid tracking data and do not correspond to a physical tool.
 * Invalid Tool objects can be the result of asking for a Tool object
 * using an ID from an earlier frame when no Tool objects with that ID
 * exist in the current frame. A Tool object created from the Tool
 * constructor is also invalid. Test for validity with the
 * <code>Tool.isValid()</code> function.</p>
 *
 * @author logotype
 *
 */
export class Tool extends Pointable
{
    constructor()
    {
        super();
        this.isFinger = false;
        this.isTool = true;
    }

    /**
     * Returns an invalid Tool object.
     *
     * <p>You can use the instance returned by this function in
     * comparisons testing whether a given Tool instance
     * is valid or invalid.
     * (You can also use the Tool.isValid property.)</p>
     *
     * @return The invalid Tool instance.
     *
     */
    public static invalid():Tool
    {
        return new Tool();
    }
}





/**
 * The Hand export class reports the physical characteristics of a detected hand.
 *
 * <p>Hand tracking data includes a palm position and velocity; vectors for
 * the palm normal and direction to the fingers; properties of a sphere fit
 * to the hand; and lists of the attached fingers and tools.</p>
 *
 * <p>Note that Hand objects can be invalid, which means that they do not
 * contain valid tracking data and do not correspond to a physical entity.
 * Invalid Hand objects can be the result of asking for a Hand object using
 * an ID from an earlier frame when no Hand objects with that ID exist in
 * the current frame. A Hand object created from the Hand constructor is
 * also invalid. Test for validity with the <code>Hand.isValid()</code> function.</p>
 *
 * @author logotype
 *
 */
export class Hand
{
    /**
     * The direction from the palm position toward the fingers.
     *
     * <p>The direction is expressed as a unit vector pointing in the same
     * direction as the directed line from the palm position to the fingers.</p>
     */
    public direction:Vector3;

    /**
     * The list of Finger objects detected in this frame that are attached
     * to this hand, given in arbitrary order.
     * @see Finger
     */
    public fingers:Finger[] = [];

    /**
     * The Frame associated with this Hand.
     * @see Frame
     */
    public frame:Frame;

    /**
     * A unique ID assigned to this Hand object, whose value remains
     * the same across consecutive frames while the tracked hand remains visible.
     *
     * <p>If tracking is lost (for example, when a hand is occluded by another
     * hand or when it is withdrawn from or reaches the edge of the Leap field
     * of view), the Leap may assign a new ID when it detects the hand in a future frame.</p>
     *
     * <p>Use the ID value with the <code>Frame.hand()</code> to find this Hand object
     * in future frames.</p>
     */
    public id:number;

    /**
     * The normal vector to the palm.
     */
    public palmNormal:Vector3;

    /**
     * The center position of the palm in millimeters from the Leap origin.
     */
    public palmPosition:Vector3;

    /**
     * The rate of change of the palm position in millimeters/second.
     */
    public palmVelocity:Vector3;

    /**
     * The list of Pointable objects (fingers and tools) detected in this
     * frame that are associated with this hand, given in arbitrary order.
     *
     * <p>The list can be empty if no fingers or tools associated with this hand are detected.
     * Use the <code>Pointable.isFinger()</code> to determine whether or not an item in the
     * list represents a finger. Use the <code>Pointable.isTool()</code> to determine
     * whether or not an item in the list represents a tool. You can also get
     * only fingers using the <code>Hand.fingers()</code> or only tools using
     * the <code>Hand.tools()</code> function.</p>
     *
     * @see Pointable
     *
     */
    public pointables:Pointable[] = [];

    /**
     * The center of a sphere fit to the curvature of this hand.
     */
    public sphereCenter:Vector3;
    /**
     * The radius of a sphere fit to the curvature of this hand.
     */
    public sphereRadius:number;

    /**
     * The list of Tool objects detected in this frame that are held by this hand, given in arbitrary order.
     * @see Tool
     */
    public tools:Tool[] =[];

    /**
     * Rotation matrix.
     */
    public rotation:Matrix;

    /**
     * Scale factor since last Frame.
     */
    public scaleFactorNumber:number;

    /**
     * Translation since last Frame.
     */
    public translationVector:Vector3;

    /**
     * Constructs a Hand object.
     *
     * <p>An uninitialized hand is considered invalid.
     *
     * Get valid Hand objects from a Frame object.</p>
     *
     */
    constructor()
    {
    }

    /**
     * Reports whether this is a valid Hand object.
     * @return True, if this Hand object contains valid tracking data.
     *
     */
    public isValid():boolean
    {
        if ( ( this.direction && this.direction.isValid()) && ( this.palmNormal && this.palmNormal.isValid()) && ( this.palmPosition && this.palmPosition.isValid()) && ( this.palmVelocity && this.palmVelocity.isValid()) && ( this.sphereCenter && this.sphereCenter.isValid()) )
            return true;

        return false;
    }

    /**
     * Compare Hand object equality/inequality.
     *
     * <p>Two Hand objects are equal if and only if both Hand objects
     * represent the exact same physical hand in the same frame
     * and both Hand objects are valid.</p>
     *
     * @param other The Hand object to compare with.
     * @return True; if equal. False otherwise.
     *
     */
    public isEqualTo( other:Hand ):boolean
    {
        if( this.id === other.id && this.frame === other.frame && this.isValid() && other.isValid() )
            return true;

        return false;
    }

    /**
     * The Finger object with the specified ID attached to this hand.
     *
     * <p>Use the <code>Hand.finger()</code> to retrieve a Finger object attached
     * to this hand using an ID value obtained from a previous frame.
     * This always returns a Finger object, but if no finger
     * with the specified ID is present, an invalid Finger object is returned.</p>
     *
     * <p>Note that ID values persist across frames, but only until tracking of
     * a particular object is lost. If tracking of a finger is lost and
     * subsequently regained, the new Finger object representing that
     * finger may have a different ID than that representing the finger in an earlier frame.</p>
     *
     * @param id The ID value of a Finger object from a previous frame.
     * @return The Finger object with the matching ID if one exists for
     * this hand in this frame; otherwise, an invalid Finger object is returned.
     * @see Finger
     *
     */
    public finger( id:number ):Finger
    {
        var returnValue:Finger = Finger.invalid();
        var length:number = this.fingers.length;

        for ( var i:number = 0; i < length; i++ )
        {
            if ( this.fingers[ i ].id === id )
            {
                returnValue = this.fingers[ i ];
                break;
            }
        }

        return returnValue;
    }

    /**
     * The Tool object with the specified ID held by this hand.
     *
     * <p>Use the <code>Hand.tool()</code> to retrieve a Tool object held
     * by this hand using an ID value obtained from a previous frame.
     * This always returns a Tool object, but if no tool
     * with the specified ID is present, an invalid Tool object is returned.</p>
     *
     * <p>Note that ID values persist across frames, but only until
     * tracking of a particular object is lost. If tracking of a tool
     * is lost and subsequently regained, the new Tool object
     * representing that tool may have a different ID than that
     * representing the tool in an earlier frame.</p>
     *
     * @param id The ID value of a Tool object from a previous frame.
     * @return The Tool object with the matching ID if one exists for
     * this hand in this frame; otherwise, an invalid Tool object is returned.
     * @see Tool
     *
     */
    public tool( id:number ):Tool
    {
        var returnValue:Tool = Tool.invalid();
        var length:number = this.fingers.length;

        for ( var i:number = 0; i < length; i++ )
        {
            if ( this.tools[ i ].id === id )
            {
                returnValue = this.tools[ i ];
                break;
            }
        }

        return returnValue;
    }

    /**
     * The Pointable object with the specified ID associated with this hand.
     *
     * <p>Use the <code>Hand.pointable()</code> to retrieve a Pointable object
     * associated with this hand using an ID value obtained from a previous frame.
     * This always returns a Pointable object, but if no finger or
     * tool with the specified ID is present, an invalid Pointable object is returned.</p>
     *
     * <p>Note that ID values persist across frames, but only until tracking
     * of a particular object is lost. If tracking of a finger or tool is
     * lost and subsequently regained, the new Pointable object representing
     * that finger or tool may have a different ID than that representing
     * the finger or tool in an earlier frame.</p>
     *
     * @param id
     * @return
     * @see Pointable
     *
     */
    public pointable( id:number ):Pointable
    {
        var returnValue:Pointable = Pointable.invalid();
        var length:number = this.pointables.length;

        for ( var i:number = 0; i < length; i++ )
        {
            if ( this.pointables[ i ].id === id )
            {
                returnValue = this.pointables[ i ];
                break;
            }
        }

        return returnValue;
    }

    /**
     * The axis of rotation derived from the change in orientation
     * of this hand, and any associated fingers and tools,
     * between the current frame and the specified frame.
     *
     * <p>The returned direction vector is normalized.</p>
     *
     * <p>If a corresponding Hand object is not found in sinceFrame,
     * or if either this frame or sinceFrame are invalid Frame objects,
     * then this method returns a zero vector.</p>
     *
     * @param sinceFrame The starting frame for computing the relative rotation.
     * @return A normalized direction Vector representing the heuristically
     * determined axis of rotational change of the hand between the current
     * frame and that specified in the sinceFrame parameter.
     * @see Vector3
     *
     */
    public rotationAxis( sinceFrame:Frame ):Vector3
    {
        if( sinceFrame.hand( this.id ) )
        {
            return new Vector3( this.rotation.zBasis.y - sinceFrame.hand( this.id ).rotation.yBasis.z, this.rotation.xBasis.z - sinceFrame.hand( this.id ).rotation.zBasis.x, this.rotation.yBasis.x - sinceFrame.hand( this.id ).rotation.xBasis.y ).normalized();
        }
        else
        {
            return new Vector3( 0, 0, 0 );
        }
    }

    /**
     * The angle of rotation around the rotation axis derived from the
     * overall rotational motion between the current frame and the specified frame.
     *
     * <p>The returned angle is expressed in radians measured clockwise around
     * the rotation axis (using the right-hand rule) between the
     * start and end frames. The value is always between 0 and pi radians (0 and 180 degrees).</p>
     *
     * <p>The Leap derives frame rotation from the relative change in position
     * and orientation of all objects detected in the field of view.</p>
     *
     * <p>If either this frame or sinceFrame is an invalid Frame object,
     * then the angle of rotation is zero.</p>
     *
     * @param sinceFrame The starting frame for computing the relative rotation.
     * @param axis Optional. The axis to measure rotation around.
     * @return A positive value containing the heuristically determined rotational
     * change between the current frame and that specified in the sinceFrame parameter.
     *
     */
    public rotationAngle( sinceFrame:Frame, axis:Vector3 = null ):number
    {
        if( !this.isValid() || !sinceFrame.hand( this.id ).isValid() )
            return 0.0;

        var returnValue:number = 0.0;
        var rotationSinceFrameMatrix:Matrix = this.rotationMatrix( sinceFrame );
        var cs:number = ( rotationSinceFrameMatrix.xBasis.x + rotationSinceFrameMatrix.yBasis.y + rotationSinceFrameMatrix.zBasis.z - 1 ) * 0.5;
        var angle:number = Math.acos( cs );
        returnValue = isNaN( angle ) ? 0.0 : angle;

        if( axis )
        {
            var rotAxis:Vector3 = this.rotationAxis( sinceFrame.hand( this.id ).frame );
            returnValue *= rotAxis.dot( axis.normalized() );
        }

        return returnValue;
    }

    /**
     * The transform matrix expressing the rotation derived from
     * the change in orientation of this hand, and any associated
     * fingers and tools, between the current frame and the specified frame.
     *
     * <p>If a corresponding Hand object is not found in sinceFrame,
     * or if either this frame or sinceFrame are invalid Frame objects,
     * then this method returns an identity matrix.</p>
     *
     * @param sinceFrame
     * @return A transformation Matrix representing the heuristically
     * determined rotational change of the hand between the current
     * frame and that specified in the sinceFrame parameter.
     * @see Matrix
     * @see Frame
     *
     */
    public rotationMatrix( sinceFrame:Frame ):Matrix
    {
        if( sinceFrame.hand( this.id ).isValid() )
        {
            return sinceFrame.hand( this.id ).rotation.multiply( new Matrix( new Vector3( this.rotation.xBasis.x, this.rotation.yBasis.x, this.rotation.zBasis.x ), new Vector3( this.rotation.xBasis.y, this.rotation.yBasis.y, this.rotation.zBasis.y ), new Vector3( this.rotation.xBasis.z, this.rotation.yBasis.z, this.rotation.zBasis.z ) ) );
        }
        else
        {
            return Matrix.identity();
        }
    }

    /**
     * The scale factor derived from this hand's motion between
     * the current frame and the specified frame.
     *
     * <p>The scale factor is always positive. A value of 1.0 indicates no
     * scaling took place. Values between 0.0 and 1.0 indicate contraction
     * and values greater than 1.0 indicate expansion.</p>
     *
     * <p>The Leap derives scaling from the relative inward or outward motion
     * of a hand and its associated fingers and tools (independent of
     * translation and rotation).</p>
     *
     * <p>If a corresponding Hand object is not found in sinceFrame,
     * or if either this frame or sinceFrame are invalid Frame objects,
     * then this method returns 1.0.</p>
     *
     * @param sinceFrame The starting frame for computing the relative scaling.
     * @return A positive value representing the heuristically determined
     * scaling change ratio between the current frame and that specified
     * in the sinceFrame parameter.
     *
     */
    public scaleFactor( sinceFrame:Frame ):number
    {
        var returnValue:number;
        if ( sinceFrame && sinceFrame.hand( this.id ) && sinceFrame.hand( this.id ).scaleFactorNumber )
            returnValue = Math.exp( this.scaleFactorNumber - sinceFrame.hand( this.id ).scaleFactorNumber );
        else
            returnValue = 1;

        return returnValue;
    }

    /**
     * The change of position of this hand between the current frame and the specified frame.
     *
     * @param sinceFrame The starting frame for computing the translation.
     * @return A Vector representing the heuristically determined change
     * in hand position between the current frame and that specified
     * in the sinceFrame parameter.
     * @see Vector3
     *
     */
    public translation( sinceFrame:Frame ):Vector3
    {
        var returnValue:Vector3;

        if ( sinceFrame.hand( this.id ) && sinceFrame.hand( this.id ).translationVector )
            returnValue = new Vector3( this.translationVector.x - sinceFrame.hand( this.id ).translationVector.x, this.translationVector.y - sinceFrame.hand( this.id ).translationVector.y, this.translationVector.z - sinceFrame.hand( this.id ).translationVector.z );
        else
            returnValue = new Vector3( 0, 0, 0 );

        return returnValue;
    }

    /**
     * Returns an invalid Hand object.
     *
     * <p>You can use the instance returned by this in comparisons
     * testing whether a given Hand instance is valid or invalid.
     * (You can also use the <code>Hand.isValid()</code> function.)</p>
     *
     * @return The invalid Hand instance.
     *
     */
    public static invalid():Hand
    {
        return new Hand();
    }
}








/**
 * The Frame export class represents a set of hand and finger tracking
 * data detected in a single frame.
 *
 * <p>The Leap detects hands, fingers and tools within the tracking area,
 * reporting their positions, orientations and motions in frames at
 * the Leap frame rate.</p>
 *
 * <p>Access Frame objects through a listener of a Leap Controller.
 * Add a listener to receive events when a new Frame is available.</p>
 *
 * @author logotype
 *
 */
export class Frame
{
    /**
     * The list of Finger objects detected in this frame, given in arbitrary order.<br/>
     * The list can be empty if no fingers are detected.
     */
    public fingers:Finger[] = [];

    /**
     * The list of Hand objects detected in this frame, given in arbitrary order.<br/>
     * The list can be empty if no hands are detected.
     */
    public hands:Hand[] = [];

    /**
     * The Pointable object with the specified ID in this frame.
     *
     * <p>Use the <code>Frame.pointable()</code> to retrieve the Pointable
     * object from this frame using an ID value obtained from a previous frame.
     * This always returns a Pointable object, but if no finger
     * or tool with the specified ID is present, an invalid Pointable
     * object is returned.</p>
     *
     * <p>Note that ID values persist across frames, but only until tracking
     * of a particular object is lost. If tracking of a finger or tool is
     * lost and subsequently regained, the new Pointable object representing
     * that finger or tool may have a different ID than that representing
     * the finger or tool in an earlier frame.</p>
     *
     * @see Pointable
     *
     */
    public pointables:Pointable[] = [];

    /**
     * The gestures recognized or continuing in this frame.
     *
     * <p>Circle and swipe gestures are updated every frame.
     * Tap gestures only appear in the list when they start.</p>
     */
    public _gestures:Gesture[] = [];

    /**
     * A unique ID for this Frame.
     * <p>Consecutive frames processed by the Leap have consecutive increasing values.</p>
     */
    public id:number;

    /**
     * The current InteractionBox for the frame.
     * <p>See the InteractionBox export class documentation for more details on how this class should be used.</p>
     * @see InteractionBox
     */
    public interactionBox:InteractionBox;

    /**
     * The frame capture time in microseconds elapsed since the Leap started.
     */
    public timestamp:number;

    /**
     * The list of Tool objects detected in this frame, given in arbitrary order.
     *
     * @see Tool
     */
    public tools:Tool[] = [];

    /**
     * Rotation matrix.
     */
    public rotation:Matrix;

    /**
     * Scale factor since last Frame.
     */
    public scaleFactorNumber:number;

    /**
     * Translation since last Frame.
     */
    public translationVector:Vector3;

    /**
     * Reference to the current Controller.
     */
    public controller:Controller;

    /**
     * Constructs a Frame object.
     *
     * <p>Frame instances created with this constructor are invalid.
     * Get valid Frame objects by calling the <code>LeapMotion.frame()</code> function.</p>
     *
     */
    constructor()
    {
    }

    /**
     * The Hand object with the specified ID in this frame.
     *
     * <p>Use the <code>Frame.hand()</code> to retrieve the Hand object
     * from this frame using an ID value obtained from a previous frame.
     * This always returns a Hand object, but if no hand
     * with the specified ID is present, an invalid Hand object is returned.</p>
     *
     * <p>Note that ID values persist across frames, but only until tracking
     * of a particular object is lost. If tracking of a hand is lost
     * and subsequently regained, the new Hand object representing
     * that physical hand may have a different ID than that
     * representing the physical hand in an earlier frame.</p>
     *
     * @param id The ID value of a Hand object from a previous frame.
     * @return The Hand object with the matching ID if one exists
     * in this frame; otherwise, an invalid Hand object is returned.
     * @see Hand
     *
     */
    public hand( id:number ):Hand
    {
        var returnValue:Hand = Hand.invalid();
        var length:number = this.hands.length;

        for ( var i:number = 0; i < length; i++ )
        {
            if ( this.hands[ i ].id === id )
            {
                returnValue = this.hands[ i ];
                break;
            }
        }

        return returnValue;
    }

    /**
     * The Finger object with the specified ID in this frame.
     *
     * <p>Use the <code>Frame.finger()</code> to retrieve the Finger
     * object from this frame using an ID value obtained from a
     * previous frame. This always returns a Finger object,
     * but if no finger with the specified ID is present, an
     * invalid Finger object is returned.</p>
     *
     * <p>Note that ID values persist across frames, but only until
     * tracking of a particular object is lost. If tracking of a
     * finger is lost and subsequently regained, the new Finger
     * object representing that physical finger may have a different
     * ID than that representing the finger in an earlier frame.</p>
     *
     * @param id The ID value of a Finger object from a previous frame.
     * @return The Finger object with the matching ID if one exists
     * in this frame; otherwise, an invalid Finger object is returned.
     * @see Finger
     *
     */
    public finger( id:number ):Finger
    {
        var returnValue:Finger = Finger.invalid();
        var length:number = this.fingers.length;

        for ( var i:number = 0; i < length; i++ )
        {
            if ( this.fingers[ i ].id === id )
            {
                returnValue = this.fingers[ i ];
                break;
            }
        }

        return returnValue;
    }

    /**
     * The Tool object with the specified ID in this frame.
     *
     * <p>Use the <code>Frame.tool()</code> to retrieve the Tool
     * object from this frame using an ID value obtained from
     * a previous frame. This always returns a Tool
     * object, but if no tool with the specified ID is present,
     * an invalid Tool object is returned.</p>
     *
     * <p>Note that ID values persist across frames, but only until
     * tracking of a particular object is lost. If tracking of a
     * tool is lost and subsequently regained, the new Tool
     * object representing that tool may have a different ID
     * than that representing the tool in an earlier frame.</p>
     *
     * @param id The ID value of a Tool object from a previous frame.
     * @return The Tool object with the matching ID if one exists in
     * this frame; otherwise, an invalid Tool object is returned.
     * @see Tool
     *
     */
    public tool( id:number ):Tool
    {
        var returnValue:Tool = Tool.invalid();
        var length:number = this.fingers.length;

        for ( var i:number = 0; i < length; i++ )
        {
            if ( this.tools[ i ].id === id )
            {
                returnValue = this.tools[ i ];
                break;
            }
        }

        return returnValue;
    }

    /**
     * The Pointable object with the specified ID in this frame.
     *
     * <p>Use the <code>Frame.pointable()</code> to retrieve the Pointable
     * object from this frame using an ID value obtained from a previous frame.
     * This always returns a Pointable object, but if no finger
     * or tool with the specified ID is present, an invalid
     * Pointable object is returned.</p>
     *
     * <p>Note that ID values persist across frames, but only until tracking
     * of a particular object is lost. If tracking of a finger or tool is
     * lost and subsequently regained, the new Pointable object representing
     * that finger or tool may have a different ID than that representing
     * the finger or tool in an earlier frame.</p>
     *
     * @param id The ID value of a Pointable object from a previous frame.
     * @return The Pointable object with the matching ID if one exists
     * in this frame; otherwise, an invalid Pointable object is returned.
     *
     */
    public pointable( id:number ):Pointable
    {
        var returnValue:Pointable = Pointable.invalid();
        var length:number = this.pointables.length;

        for ( var i:number = 0; i < length; i++ )
        {
            if ( this.pointables[ i ].id === id )
            {
                returnValue = this.pointables[ i ];
                break;
            }
        }

        return returnValue;
    }

    /**
     * The Gesture object with the specified ID in this frame.
     *
     * <p>Use the <code>Frame.gesture()</code> to return a Gesture object in this frame
     * using an ID obtained in an earlier frame. The always returns a
     * Gesture object, but if there was no update for the gesture in this frame,
     * then an invalid Gesture object is returned.</p>
     *
     * <p>All Gesture objects representing the same recognized movement share the same ID.</p>
     *
     * @param id The ID of an Gesture object from a previous frame.
     * @return The Gesture object in the frame with the specified ID if one
     * exists; Otherwise, an Invalid Gesture object.
     *
     */
    public gesture( id:number ):Gesture
    {
        var returnValue:Gesture = Gesture.invalid();
        var length:number = this._gestures.length;

        for ( var i:number = 0; i < length; i++ )
        {
            if ( this._gestures[ i ].id === id )
            {
                returnValue = this._gestures[ i ];
                break;
            }
        }

        return returnValue;
    }

    /**
     * Returns a Gesture vector containing all gestures that have occurred
     * since the specified frame.
     *
     * <p>If no frame is specifed, the gestures recognized or continuing in
     * this frame will be returned.</p>
     *
     * @param sinceFrame An earlier Frame object. The starting frame must
     * still be in the frame history cache, which has a default length of 60 frames.
     * @return The list of gestures.
     *
     */
    public gestures( sinceFrame:Frame = null ):Gesture[]
    {
        if( !sinceFrame )
        {
            // The gestures recognized or continuing in this frame.
            return this._gestures;
        }
        else
        {
            // Returns a Gesture vector containing all gestures that have occurred since the specified frame.
            var gesturesSinceFrame:Gesture[] = [];

            for ( var i:number = 0; i < this.controller.frameHistory.length; i++ )
            {
                for ( var j:number = 0; j < this.controller.frameHistory[ i ]._gestures.length; ++j )
                    gesturesSinceFrame.push( this.controller.frameHistory[ i ]._gestures[ j ] );

                if( sinceFrame === this.controller.frameHistory[ i ] )
                    break;
            }

            return gesturesSinceFrame;
        }
    }

    /**
     * The axis of rotation derived from the overall rotational
     * motion between the current frame and the specified frame.
     *
     * <p>The returned direction vector is normalized.</p>
     *
     * <p>The Leap derives frame rotation from the relative change
     * in position and orientation of all objects detected in
     * the field of view.</p>
     *
     * <p>If either this frame or sinceFrame is an invalid Frame
     * object, or if no rotation is detected between the
     * two frames, a zero vector is returned.</p>
     *
     * @param sinceFrame The starting frame for computing the relative rotation.
     * @return A normalized direction Vector representing the axis of the
     * heuristically determined rotational change between the current
     * frame and that specified in the sinceFrame parameter.
     *
     */
    public rotationAxis( sinceFrame:Frame ):Vector3
    {
        if( sinceFrame && sinceFrame.rotation )
        {
            var vector:Vector3 = new Vector3( this.rotation.zBasis.y - sinceFrame.rotation.yBasis.z, this.rotation.xBasis.z - sinceFrame.rotation.zBasis.x, this.rotation.yBasis.x - sinceFrame.rotation.xBasis.y );
            return vector.normalized();
        }
        else
        {
            return new Vector3( 0, 0, 0 );
        }
    }

    /**
     * The angle of rotation around the rotation axis derived from the
     * overall rotational motion between the current frame and the specified frame.
     *
     * <p>The returned angle is expressed in radians measured clockwise around
     * the rotation axis (using the right-hand rule) between the
     * start and end frames. The value is always between 0 and pi radians (0 and 180 degrees).</p>
     *
     * <p>The Leap derives frame rotation from the relative change in position
     * and orientation of all objects detected in the field of view.</p>
     *
     * <p>If either this frame or sinceFrame is an invalid Frame object,
     * then the angle of rotation is zero.</p>
     *
     * @param sinceFrame The starting frame for computing the relative rotation.
     * @param axis Optional. The axis to measure rotation around.
     * @return A positive value containing the heuristically determined rotational
     * change between the current frame and that specified in the sinceFrame parameter.
     *
     */
    public rotationAngle( sinceFrame:Frame, axis:Vector3 = null ):number
    {
        if( !this.isValid() || !sinceFrame.isValid() )
            return 0.0;

        var returnValue:number = 0.0;
        var rotationSinceFrameMatrix:Matrix = this.rotationMatrix( sinceFrame );
        var cs:number = ( rotationSinceFrameMatrix.xBasis.x + rotationSinceFrameMatrix.yBasis.y + rotationSinceFrameMatrix.zBasis.z - 1 ) * 0.5;
        var angle:number = Math.acos( cs );
        returnValue = isNaN( angle ) ? 0.0 : angle;

        if( axis )
        {
            var rotAxis:Vector3 = this.rotationAxis( sinceFrame );
            returnValue *= rotAxis.dot( axis.normalized() );
        }

        return returnValue;
    }

    /**
     * The transform matrix expressing the rotation derived from
     * the change in orientation of this hand, and any associated
     * fingers and tools, between the current frame and the specified frame.
     *
     * <p>If a corresponding Hand object is not found in sinceFrame,
     * or if either this frame or sinceFrame are invalid Frame objects,
     * then this method returns an identity matrix.</p>
     *
     * @param sinceFrame
     * @return
     *
     */
    public rotationMatrix( sinceFrame:Frame ):Matrix
    {
        if( sinceFrame && sinceFrame.rotation )
        {
            return sinceFrame.rotation.multiply( new Matrix( new Vector3( this.rotation.xBasis.x, this.rotation.yBasis.x, this.rotation.zBasis.x ), new Vector3( this.rotation.xBasis.y, this.rotation.yBasis.y, this.rotation.zBasis.y ), new Vector3( this.rotation.xBasis.z, this.rotation.yBasis.z, this.rotation.zBasis.z ) ) );
        }
        else
        {
            return Matrix.identity();
        }
    }

    /**
     * The scale factor derived from the overall motion between the
     * current frame and the specified frame.
     *
     * <p>The scale factor is always positive. A value of 1.0 indicates no
     * scaling took place. Values between 0.0 and 1.0 indicate contraction
     * and values greater than 1.0 indicate expansion.</p>
     *
     * <p>The Leap derives scaling from the relative inward or outward
     * motion of all objects detected in the field of view (independent
     * of translation and rotation).</p>
     *
     * <p>If either this frame or sinceFrame is an invalid Frame object,
     * then this method returns 1.0.</p>
     *
     * @param sinceFrame The starting frame for computing the relative scaling.
     * @return A positive value representing the heuristically determined
     * scaling change ratio between the current frame and that specified
     * in the sinceFrame parameter.
     *
     */
    public scaleFactor( sinceFrame:Frame ):number
    {
        var returnValue:number;
        if ( sinceFrame && sinceFrame.scaleFactorNumber )
            returnValue = Math.exp( this.scaleFactorNumber - sinceFrame.scaleFactorNumber );
        else
            returnValue = 1;

        return returnValue;
    }

    /**
     * The change of position derived from the overall linear motion
     * between the current frame and the specified frame.
     *
     * <p>The returned translation vector provides the magnitude and
     * direction of the movement in millimeters.</p>
     *
     * <p>The Leap derives frame translation from the linear motion
     * of all objects detected in the field of view.</p>
     *
     * <p>If either this frame or sinceFrame is an invalid Frame object,
     * then this method returns a zero vector.</p>
     *
     * @param sinceFrame The starting frame for computing the translation.
     * @return A Vector representing the heuristically determined change
     * in hand position between the current frame and that specified
     * in the sinceFrame parameter.
     *
     */
    public translation( sinceFrame:Frame ):Vector3
    {
        var returnValue:Vector3;

        if ( sinceFrame.translationVector )
            returnValue = new Vector3( this.translationVector.x - sinceFrame.translationVector.x, this.translationVector.y - sinceFrame.translationVector.y, this.translationVector.z - sinceFrame.translationVector.z );
        else
            returnValue = new Vector3( 0, 0, 0 );

        return returnValue;
    }

    /**
     * Compare Frame object equality.
     *
     * <p>Two Frame objects are equal if and only if both Frame objects
     * represent the exact same frame of tracking data and both
     * Frame objects are valid.</p>
     *
     * @param other The Frame to compare with.
     * @return True; if equal. False otherwise.
     *
     */
    public isEqualTo( other:Frame ):boolean
    {
        var returnValue:boolean = true;

        if( this.id != other.id || !this.isValid() || other.isValid() )
            returnValue = false;

        return returnValue;
    }

    /**
     * Reports whether this Frame instance is valid.
     *
     * <p>A valid Frame is one generated by the LeapMotion object that contains
     * tracking data for all detected entities. An invalid Frame contains
     * no actual tracking data, but you can call its functions without risk
     * of a null pointer exception. The invalid Frame mechanism makes it
     * more convenient to track individual data across the frame history.</p>
     *
     * <p>For example, you can invoke: <code>var finger:Finger = leap.frame(n).finger(fingerID);</code>
     * for an arbitrary Frame history value, "n", without first checking whether
     * frame(n) returned a null object.<br/>
     * (You should still check that the returned Finger instance is valid.)</p>
     *
     * @return True, if this is a valid Frame object; false otherwise.
     *
     */
    public isValid():boolean
    {
        if( !this.id )
            return false;

        return true;
    }

    /**
     * Returns an invalid Frame object.
     *
     * <p>You can use the instance returned by this in comparisons
     * testing whether a given Frame instance is valid or invalid.
     * (You can also use the <code>Frame.isValid()</code> function.)</p>
     *
     * @return The invalid Frame instance.
     *
     */
    public static invalid():Frame
    {
        return new Frame();
    }
}
/**
 * The Matrix struct represents a transformation matrix.
 *
 * <p>To use this struct to transform a Vector, construct a matrix containing the
 * desired transformation and then use the <code>Matrix.transformPoint()</code> or
 * <code>Matrix.transformDirection()</code> functions to apply the transform.</p>
 *
 * <p>Transforms can be combined by multiplying two or more transform matrices
 * using the <code>multiply()</code> function.</p>
 *
 *
 * @author logotype
 *
 */
export class Matrix
{
    /**
     * The translation factors for all three axes.
     */
    public origin:Vector3 = new Vector3( 0, 0, 0 );

    /**
     * The rotation and scale factors for the x-axis.
     */
    public xBasis:Vector3 = new Vector3( 0, 0, 0 );

    /**
     * The rotation and scale factors for the y-axis.
     */
    public yBasis:Vector3 = new Vector3( 0, 0, 0 );

    /**
     * The rotation and scale factors for the z-axis.
     */
    public zBasis:Vector3 = new Vector3( 0, 0, 0 );

    /**
     * Constructs a transformation matrix from the specified basis vectors.
     * @param x A Vector specifying rotation and scale factors for the x-axis.
     * @param y A Vector specifying rotation and scale factors for the y-axis.
     * @param z A Vector specifying rotation and scale factors for the z-axis.
     * @param _origin A Vector specifying translation factors on all three axes.
     *
     */
    constructor( x:Vector3, y:Vector3, z:Vector3, _origin:Vector3 = null )
    {
        this.xBasis = x;
        this.yBasis = y;
        this.zBasis = z;
    
        if( _origin )
            this.origin = _origin;
    }

    /**
     * Sets this transformation matrix to represent a rotation around the specified vector.
     * This erases any previous rotation and scale transforms applied to this matrix,
     * but does not affect translation.
     *
     * @param _axis A Vector specifying the axis of rotation.
     * @param angleRadians The amount of rotation in radians.
     *
     */
    public setRotation( _axis:Vector3, angleRadians:number ):void
    {
        var axis:Vector3 = _axis.normalized();
        var s:number = Math.sin( angleRadians );
        var c:number = Math.cos( angleRadians );
        var C:number = ( 1 - c );

        this.xBasis = new Vector3( axis.x * axis.x * C + c, axis.x * axis.y * C - axis.z * s, axis.x * axis.z * C + axis.y * s );
        this.yBasis = new Vector3( axis.y * axis.x * C + axis.z * s, axis.y * axis.y * C + c, axis.y * axis.z * C - axis.x * s );
        this.zBasis = new Vector3( axis.z * axis.x * C - axis.y * s, axis.z * axis.y * C + axis.x * s, axis.z * axis.z * C + c );
    }

    /**
     * Transforms a vector with this matrix by transforming its rotation, scale, and translation.
     * Translation is applied after rotation and scale.
     *
     * @param inVector The Vector to transform.
     * @return A new Vector representing the transformed original.
     *
     */
    public transformPoint( inVector:Vector3 ):Vector3
    {
        return new Vector3( this.xBasis.multiply( inVector.x ).x, this.yBasis.multiply( inVector.y ).y, this.zBasis.multiply( inVector.z ).z + this.origin.z );
    }

    /**
     * Transforms a vector with this matrix by transforming its rotation and scale only.
     * @param inVector The Vector to transform.
     * @return A new Vector representing the transformed original.
     *
     */
    public transformDirection( inVector:Vector3 ):Vector3
    {
        var x:Vector3 = this.xBasis.multiply( inVector.x );
        var y:Vector3 = this.yBasis.multiply( inVector.y );
        var z:Vector3 = this.zBasis.multiply( inVector.z );
        return x.plus( y ).plus( z );
    }

    /**
     * Performs a matrix inverse if the matrix consists entirely of rigid transformations (translations and rotations).
     * @return The rigid inverse of the matrix.
     *
     */
    public rigidInverse():Matrix
    {
        var rotInverse:Matrix = new Matrix( new Vector3( this.xBasis.x, this.yBasis.x, this.zBasis.x ), new Vector3( this.xBasis.y, this.yBasis.y, this.zBasis.y ), new Vector3( this.xBasis.z, this.yBasis.z, this.zBasis.z ) );
        if( this.origin )
            rotInverse.origin = rotInverse.transformDirection( this.origin.opposite() );
        return rotInverse;
    }

    /**
     * Multiply transform matrices.
     * @param other A Matrix to multiply on the right hand side.
     * @return A new Matrix representing the transformation equivalent to applying the other transformation followed by this transformation.
     *
     */
    public multiply( other:Matrix ):Matrix
    {
        var x:Vector3 = this.transformDirection( other.xBasis );
        var y:Vector3 = this.transformDirection( other.yBasis );
        var z:Vector3 = this.transformDirection( other.zBasis );
        var o:Vector3 = this.origin;

        if( this.origin && other.origin )
            o = this.transformPoint( other.origin );

        return new Matrix( x, y, z, o );
    }

    /**
     * Multiply transform matrices and assign the product.
     * @param other A Matrix to multiply on the right hand side.
     * @return This Matrix representing the transformation equivalent to applying the other transformation followed by this transformation.
     *
     */
    public multiplyAssign( other:Matrix ):Matrix
    {
        this.xBasis = this.transformDirection( other.xBasis );
        this.yBasis = this.transformDirection( other.yBasis );
        this.zBasis = this.transformDirection( other.zBasis );
        this.origin = this.transformPoint( other.origin );
        return this;
    }

    /**
     * Compare Matrix equality/inequality component-wise.
     * @param other The Matrix to compare with.
     * @return True; if equal, False otherwise.
     *
     */
    public isEqualTo( other:Matrix ):boolean
    {
        if( !this.xBasis.isEqualTo( other.xBasis ) )
            return false;

        if( !this.yBasis.isEqualTo( other.yBasis ) )
            return false;

        if( !this.zBasis.isEqualTo( other.zBasis ) )
            return false;

        if( !this.origin.isEqualTo( other.origin ) )
            return false;

        return true;
    }

    /**
     * Returns the identity matrix specifying no translation, rotation, and scale.
     * @return The identity matrix.
     *
     */
    public static identity():Matrix
    {
        var xBasis:Vector3 = new Vector3( 1, 0, 0 );
        var yBasis:Vector3 = new Vector3( 0, 1, 0 );
        var zBasis:Vector3 = new Vector3( 0, 0, 1 );

        return new Matrix( xBasis, yBasis, zBasis );
    }

    /**
     * Write the matrix to a string in a human readable format.
     * @return
     *
     */
    public toString():string
    {
        return "[Matrix xBasis:" + this.xBasis.toString() + " yBasis:" + this.yBasis.toString() + " zBasis:" + this.zBasis.toString() + " origin:" + this.origin.toString() + "]";
    }
}


/**
 * The CircleGesture export class represents a circular finger movement.
 *
 * <p>A circle movement is recognized when the tip of a finger draws
 * a circle within the Leap field of view.</p>
 *
 * <p><strong>Important: To use circle gestures in your application, you must
 * enable recognition of the circle gesture.</strong><br/>
 * You can enable recognition with:</p>
 *
 * <code>leap.controller.enableGesture(Gesture.TYPE_CIRCLE);</code>
 *
 * <p>Circle gestures are continuous. The CircleGesture objects for
 * the gesture have three possible states:</p>
 *
 * <p><code>Gesture.STATE_START</code> – The circle gesture has just started.
 * The movement has progressed far enough for the recognizer to classify it as a circle.</p>
 *
 * <p><code>Gesture.STATE_UPDATE</code> – The circle gesture is continuing.</p>
 *
 * <p><code>Gesture.STATE_STOP</code> – The circle gesture is finished.</p>
 *
 * <p>You can set the minimum radius and minimum arc length required for a
 * movement to be recognized as a circle using the config attribute of a
 * connected Controller object. Use the following keys to configure circle recognition:</p>
 *
 * <table class="innertable">
 *   <tr>
 *    <th>Key string</th>
 *    <th>Value type</th>
 *    <th>Default value</th>
 *    <th>Units</th>
 *  </tr>
 *   <tr>
 *    <td>Gesture.Circle.MinRadius</td>
 *    <td>float</td>
 *    <td>5.0</td>
 *    <td>mm</td>
 *  </tr>
 *   <tr>
 *    <td>Gesture.Circle.MinArc</td>
 *    <td>float</td>
 *    <td>1.5&#42;pi</td>
 *    <td>radians</td>
 *  </tr>
 * </table>
 *
 * <p>The following example demonstrates how to set the circle configuration parameters:</p>
 *
 * <listing>if(controller.config().setFloat(&quot;Gesture.Circle.MinRadius&quot;, 10.0) &amp;&amp;
 *       controller.config().setFloat(&quot;Gesture.Circle.MinArc&quot;, .5))
 *        controller.config().save();</listing>
 *
 * @author logotype
 * @see Gesture
 *
 */
export class CircleGesture extends Gesture
{
    /**
     * The circle gesture type.<br/>
     * The type value designating a circle gesture.
     */
    public static classType:number = Type.TYPE_CIRCLE;

    /**
     * The center point of the circle within the Leap frame of reference.<br/>
     * The center of the circle in mm from the Leap origin.
     */
    public center:Vector3;

    /**
     * Returns the normal vector for the circle being traced.
     *
     * <p>If you draw the circle clockwise, the normal vector points in the
     * same general direction as the pointable object drawing the circle.
     * If you draw the circle counterclockwise, the normal points back
     * toward the pointable. If the angle between the normal and the
     * pointable object drawing the circle is less than 90 degrees,
     * then the circle is clockwise.</p>
     */
    public normal:Vector3;

    /**
     * The Finger or Tool performing the circle gesture.
     */
    public pointable:Pointable;

    /**
     * The number of times the finger tip has traversed the circle.
     *
     * <p>Progress is reported as a positive number of the number. For example,
     * a progress value of .5 indicates that the finger has gone halfway around,
     * while a value of 3 indicates that the finger has gone around the the
     * circle three times.</p>
     *
     * <p>Progress starts where the circle gesture began. Since it the circle must
     * be partially formed before the Leap can recognize it, progress will be
     * greater than zero when a circle gesture first appears in the frame.</p>
     */
    public progress:number;

    /**
     * The circle radius in mm.
     */
    public radius:number;

    /**
     * Constructs a new CircleGesture object.
     *
     * <p>An uninitialized CircleGesture object is considered invalid.
     * Get valid instances of the CircleGesture export class from a Frame object.</p>
     *
     */
    constructor()
    {
        super();
        this.pointable = Pointable.invalid();
    }
}


/**
 * The KeyTapGesture export class represents a tapping gesture by a finger or tool.
 *
 * <p>A key tap gesture is recognized when the tip of a finger rotates down
 * toward the palm and then springs back to approximately the original
 * postion, as if tapping. The tapping finger must pause briefly before
 * beginning the tap.</p>
 *
 * <p><strong>Important: To use key tap gestures in your application, you must enable
 * recognition of the key tap gesture.</strong><br/>You can enable recognition with:</p>
 *
 * <code>leap.controller.enableGesture(Gesture.TYPE_KEY_TAP);</code>
 *
 * <p>Key tap gestures are discrete. The KeyTapGesture object representing a
 * tap always has the state, <code>STATE_STOP</code>. Only one KeyTapGesture object
 * is created for each key tap gesture recognized.</p>
 *
 * <p>You can set the minimum finger movement and velocity required for a movement
 * to be recognized as a key tap as well as adjust the detection window for evaluating
 * the movement using the config attribute of a connected Controller object.
 * Use the following configuration keys to configure key tap recognition:</p>
 *
 * <table class="innertable">
 *   <tr>
 *    <th>Key string</th>
 *    <th>Value type</th>
 *    <th>Default value</th>
 *    <th>Units</th>
 *  </tr>
 *   <tr>
 *    <td>Gesture.KeyTap.MinDownVelocity</td>
 *    <td>float</td>
 *    <td>50</td>
 *    <td>mm/s</td>
 *  </tr>
 *   <tr>
 *    <td>Gesture.KeyTap.HistorySeconds</td>
 *    <td>float</td>
 *    <td>0.1</td>
 *    <td>s</td>
 *  </tr>
 *   <tr>
 *    <td>Gesture.KeyTap.MinDistance</td>
 *    <td>float</td>
 *    <td>5.0</td>
 *    <td>mm</td>
 *  </tr>
 * </table>
 *
 * <p>The following example demonstrates how to set the screen tap configuration parameters:</p>
 *
 * <code>if(controller.config().setFloat(&quot;Gesture.KeyTap.MinDownVelocity&quot;, 40.0) &amp;&amp;
 *       controller.config().setFloat(&quot;Gesture.KeyTap.HistorySeconds&quot;, .2) &amp;&amp;
 *       controller.config().setFloat(&quot;Gesture.KeyTap.MinDistance&quot;, 8.0))
 *        controller.config().save();</code>
 *
 * @author logotype
 *
 */
export class KeyTapGesture extends Gesture
{
    /**
     * The type value designating a key tap gesture.
     */
    public static classType:number = Type.TYPE_KEY_TAP;

    /**
     * The current direction of finger tip motion.
     *
     * <p>At the start of the key tap gesture, the direction points in the
     * direction of the tap. At the end of the key tap gesture, the direction
     * will either point toward the original finger tip position or it will
     * be a zero-vector, which indicates that finger movement stopped before
     * returning to the starting point.</p>
     */
    public direction:Vector3;

    /**
     * The finger performing the key tap gesture.
     */
    public pointable:Pointable;

    /**
     * The position where the key tap is registered.
     */
    public position:Vector3;

    /**
     * The progess value is always 1.0 for a key tap gesture.
     */
    public progress:number = 1;

    /**
     * Constructs a new KeyTapGesture object.
     *
     * <p>An uninitialized KeyTapGesture object is considered invalid.
     * Get valid instances of the KeyTapGesture export class from a Frame object.</p>
     *
     */
    constructor()
    {
        super();
    }
}


/**
 * The ScreenTapGesture export class represents a tapping gesture by a finger or tool.
 *
 * <p>A screen tap gesture is recognized when the tip of a finger pokes forward
 * and then springs back to approximately the original postion, as if tapping
 * a vertical screen. The tapping finger must pause briefly before beginning the tap.</p>
 *
 * <strong>Important: To use screen tap gestures in your application, you must enable
 * recognition of the screen tap gesture.</strong><br/> You can enable recognition with:
 *
 * <code>leap.controller.enableGesture(Gesture.TYPE_SCREEN_TAP);</code>
 *
 * <p>ScreenTap gestures are discrete. The ScreenTapGesture object representing a
 * tap always has the state, <code>STATE_STOP</code>. Only one ScreenTapGesture object is
 * created for each screen tap gesture recognized.</p>
 *
 * <p>You can set the minimum finger movement and velocity required for a movement
 * to be recognized as a screen tap as well as adjust the detection window for
 * evaluating the movement using the config attribute of a connected Controller object.
 * Use the following keys to configure screen tap recognition:</p>
 *
 * <table class="innertable">
 *   <tr>
 *    <th>Key string</th>
 *    <th>Value type</th>
 *    <th>Default value</th>
 *    <th>Units</th>
 *  </tr>
 *   <tr>
 *    <td>Gesture.ScreenTap.MinForwardVelocity</td>
 *    <td>float</td>
 *    <td>50</td>
 *    <td>mm/s</td>
 *  </tr>
 *   <tr>
 *    <td>Gesture.ScreenTap.HistorySeconds</td>
 *    <td>float</td>
 *    <td>0.1</td>
 *    <td>s</td>
 *  </tr>
 *   <tr>
 *    <td>Gesture.ScreenTap.MinDistance</td>
 *    <td>float</td>
 *    <td>3.0</td>
 *    <td>mm</td>
 *  </tr>
 * </table>
 *
 * <p>The following example demonstrates how to set the screen tap configuration parameters:</p>
 *
 * <code> if(controller.config().setFloat(&quot;Gesture.ScreenTap.MinForwardVelocity&quot;, 30.0) &amp;&amp;
 *       controller.config().setFloat(&quot;Gesture.ScreenTap.HistorySeconds&quot;, .5) &amp;&amp;
 *       controller.config().setFloat(&quot;Gesture.ScreenTap.MinDistance&quot;, 1.0))
 *        controller.config().save();</code>
 *
 * @author logotype
 *
 */
export class ScreenTapGesture extends Gesture
{
    /**
     * The type value designating a screen tap gesture.
     */
    public static classType:number = Type.TYPE_SCREEN_TAP;

    /**
     * The direction of finger tip motion.
     */
    public direction:Vector3;

    /**
     * The finger performing the screen tap gesture.
     */
    public pointable:Pointable;

    /**
     * The position where the screen tap is registered.
     */
    public position:Vector3;

    /**
     * The progess value is always 1.0 for a screen tap gesture.
     */
    public progress:number = 1;

    /**
     * Constructs a new ScreenTapGesture object.
     *
     * <p>An uninitialized ScreenTapGesture object is considered invalid.
     * Get valid instances of the ScreenTapGesture export class from a Frame object.</p>
     *
     */
    constructor()
    {
        super();
    }
}


/**
 * The SwipeGesture export class represents a swiping motion of a finger or tool.
 *
 * <p><strong>Important: To use swipe gestures in your application, you must enable
 * recognition of the swipe gesture.</strong><br/>You can enable recognition with:</p>
 *
 * <p><code>leap.controller.enableGesture(Gesture.TYPE_SWIPE);</code></p>
 *
 * <p>Swipe gestures are continuous.</p>
 *
 * <p>You can set the minimum length and velocity required for a movement to be
 * recognized as a swipe using the config attribute of a connected Controller object.
 * Use the following keys to configure swipe recognition:</p>
 *
 * <table class="innertable">
 *   <tr>
 *    <th>Key string</th>
 *    <th>Value type</th>
 *    <th>Default value</th>
 *    <th>Units</th>
 *  </tr>
 *   <tr>
 *    <td>Gesture.Swipe.MinLength</td>
 *    <td>float</td>
 *    <td>150</td>
 *    <td>mm</td>
 *  </tr>
 *   <tr>
 *    <td>Gesture.Swipe.MinVelocity</td>
 *    <td>float</td>
 *    <td>1000</td>
 *    <td>mm/s</td>
 *  </tr>
 * </table>
 *
 * <p>The following example demonstrates how to set the swipe configuration parameters:</p>
 *
 * <code>if(controller.config().setFloat(&quot;Gesture.Swipe.MinLength&quot;, 200.0) &amp;&amp;
 *       controller.config().setFloat(&quot;Gesture.Swipe.MinVelocity&quot;, 750))
 *        controller.config().save();</code>
 *
 * @author logotype
 *
 */
export class SwipeGesture extends Gesture
{
    /**
     * The type value designating a swipe gesture.
     */
    public static classType:number = Type.TYPE_SWIPE;

    /**
     * The unit direction vector parallel to the swipe motion.
     *
     * <p>You can compare the components of the vector to classify the swipe
     * as appropriate for your application. For example, if you are using
     * swipes for two dimensional scrolling, you can compare the x and y
     * values to determine if the swipe is primarily horizontal or vertical.</p>
     */
    public direction:Vector3;

    /**
     * The Finger or Tool performing the swipe gesture.
     */
    public pointable:Pointable;

    /**
     * The current swipe position within the Leap frame of reference, in mm.
     */
    public position:Vector3;

    /**
     * The speed of the finger performing the swipe gesture in millimeters per second.
     */
    public speed:number;

    /**
     * The position where the swipe began.
     */
    public startPosition:Vector3;

    /**
     * Constructs a SwipeGesture object from an instance of the Gesture class.
     *
     */
    constructor()
    {
        super();
    }
}/**
 * The Vector struct represents a three-component mathematical vector
 * or point such as a direction or position in three-dimensional space.
 *
 * <p>The Leap software employs a right-handed Cartesian coordinate system.
 * Values given are in units of real-world millimeters. The origin is
 * centered at the center of the Leap Motion Controller. The x- and z-axes lie in
 * the horizontal plane, with the x-axis running parallel to the long edge
 * of the device. The y-axis is vertical, with positive values increasing
 * upwards (in contrast to the downward orientation of most computer
 * graphics coordinate systems). The z-axis has positive values increasing
 * away from the computer screen.</p>
 *
 * @author logotype
 *
 */
export class Vector3
{
    /**
     * The horizontal component.
     */
    public x:number;

    /**
     * The vertical component.
     */
    public y:number;

    /**
     * The depth component.
     */
    public z:number;

    /**
     * Creates a new Vector with the specified component values.
     * @constructor
     * @param x The horizontal component.
     * @param y The vertical component.
     * @param z The depth component.
     *
     */
    constructor( x:number, y:number, z:number )
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * A copy of this vector pointing in the opposite direction.
     * @return A Vector3 object with all components negated.
     *
     */
    public opposite():Vector3
    {
        return new Vector3( -this.x, -this.y, -this.z );
    }

    /**
     * Add vectors component-wise.
     * @param other
     * @return
     *
     */
    public plus( other:Vector3 ):Vector3
    {
        return new Vector3( this.x + other.x, this.y + other.y, this.z + other.z );
    }

    /**
     * Add vectors component-wise and assign the value.
     * @param other
     * @return This Vector3.
     *
     */
    public plusAssign( other:Vector3 ):Vector3
    {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    }

    /**
     * A copy of this vector pointing in the opposite direction.
     * @param other
     * @return
     *
     */
    public minus( other:Vector3 ):Vector3
    {
        return new Vector3( this.x - other.x, this.y - other.y, this.z - other.z );
    }

    /**
     * A copy of this vector pointing in the opposite direction and assign the value.
     * @param other
     * @return This Vector3.
     *
     */
    public minusAssign( other:Vector3 ):Vector3
    {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    }

    /**
     * Multiply vector by a scalar.
     * @param scalar
     * @return
     *
     */
    public multiply( scalar:number ):Vector3
    {
        return new Vector3( this.x * scalar, this.y * scalar, this.z * scalar );
    }

    /**
     * Multiply vector by a scalar and assign the quotient.
     * @param scalar
     * @return This Vector3.
     *
     */
    public multiplyAssign( scalar:number ):Vector3
    {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }

    /**
     * Divide vector by a scalar.
     * @param scalar
     * @return
     *
     */
    public divide( scalar:number ):Vector3
    {
        return new Vector3( this.x / scalar, this.y / scalar, this.z / scalar );
    }

    /**
     * Divide vector by a scalar and assign the value.
     * @param scalar
     * @return This Vector3.
     *
     */
    public divideAssign( scalar:number ):Vector3
    {
        this.x /= scalar;
        this.y /= scalar;
        this.z /= scalar;
        return this;
    }

    /**
     * Compare Vector equality/inequality component-wise.
     * @param other The Vector3 to compare with.
     * @return True; if equal, False otherwise.
     *
     */
    public isEqualTo( other:Vector3 ):boolean
    {
        return ( this.x != other.x || this.y != other.y || this.z != other.z );
    }

    /**
     * The angle between this vector and the specified vector in radians.
     *
     * <p>The angle is measured in the plane formed by the two vectors.
     * The angle returned is always the smaller of the two conjugate angles.
     * Thus <code>A.angleTo(B) === B.angleTo(A)</code> and is always a positive value less
     * than or equal to pi radians (180 degrees).</p>
     *
     * <p>If either vector has zero length, then this returns zero.</p>
     *
     * @param other A Vector object.
     * @return The angle between this vector and the specified vector in radians.
     *
     */
    public angleTo( other:Vector3 ):number
    {
        var denom:number = this.magnitudeSquared() * other.magnitudeSquared();
        if ( denom <= 0 )
            return 0;

        return Math.acos( this.dot( other ) / Math.sqrt( denom ) );
    }

    /**
     * The cross product of this vector and the specified vector.
     *
     * The cross product is a vector orthogonal to both original vectors.
     * It has a magnitude equal to the area of a parallelogram having the
     * two vectors as sides. The direction of the returned vector is
     * determined by the right-hand rule. Thus <code>A.cross(B) === -B.cross(A)</code>.
     *
     * @param other A Vector object.
     * @return The cross product of this vector and the specified vector.
     *
     */
    public cross( other:Vector3 ):Vector3
    {
        return new Vector3( ( this.y * other.z ) - ( this.z * other.y ), ( this.z * other.x ) - ( this.x * other.z ), ( this.x * other.y ) - ( this.y * other.x ) );
    }

    /**
     * The distance between the point represented by this Vector
     * object and a point represented by the specified Vector object.
     *
     * @param other A Vector object.
     * @return The distance from this point to the specified point.
     *
     */
    public distanceTo( other:Vector3 ):number
    {
        return Math.sqrt( ( this.x - other.x ) * ( this.x - other.x ) + ( this.y - other.y ) * ( this.y - other.y ) + ( this.z - other.z ) * ( this.z - other.z ) );
    }

    /**
     * The dot product of this vector with another vector.
     * The dot product is the magnitude of the projection of this vector
     * onto the specified vector.
     *
     * @param other A Vector object.
     * @return The dot product of this vector and the specified vector.
     *
     */
    public dot( other:Vector3 ):number
    {
        return ( this.x * other.x ) + ( this.y * other.y ) + ( this.z * other.z );
    }

    /**
     * Returns true if all of the vector's components are finite.
     * @return If any component is NaN or infinite, then this returns false.
     *
     */
    public isValid():boolean
    {
        return ( this.x <= Number.MAX_VALUE && this.x >= -Number.MAX_VALUE ) && ( this.y <= Number.MAX_VALUE && this.y >= -Number.MAX_VALUE ) && ( this.z <= Number.MAX_VALUE && this.z >= -Number.MAX_VALUE );
    }

    /**
     * Returns an invalid Vector3 object.
     *
     * You can use the instance returned by this in
     * comparisons testing whether a given Vector3 instance
     * is valid or invalid.
     * (You can also use the Vector3.isValid property.)
     *
     * @return The invalid Vector3 instance.
     *
     */
    public static invalid():Vector3
    {
        return new Vector3(NaN, NaN, NaN);
    }

    /**
     * The magnitude, or length, of this vector.
     * The magnitude is the L2 norm, or Euclidean distance between the
     * origin and the point represented by the (x, y, z) components
     * of this Vector object.
     *
     * @return The length of this vector.
     *
     */
    public magnitude():number
    {
        return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
    }

    /**
     * The square of the magnitude, or length, of this vector.
     * @return The square of the length of this vector.
     *
     */
    public magnitudeSquared():number
    {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    /**
     * A normalized copy of this vector.
     * A normalized vector has the same direction as the original
     * vector, but with a length of one.
     * @return A Vector object with a length of one, pointing in the same direction as this Vector object.
     *
     */
    public normalized():Vector3
    {
        var denom:number = this.magnitudeSquared();
        if ( denom <= 0 )
            return new Vector3( 0, 0, 0 );

        denom = 1 / Math.sqrt( denom );
        return new Vector3( this.x * denom, this.y * denom, this.z * denom );
    }

    /**
     * The pitch angle in radians.
     * Pitch is the angle between the negative z-axis and the projection
     * of the vector onto the y-z plane. In other words, pitch represents
     * rotation around the x-axis. If the vector points upward, the
     * returned angle is between 0 and pi radians (180 degrees); if it
     * points downward, the angle is between 0 and -pi radians.
     *
     * @return The angle of this vector above or below the horizon (x-z plane).
     *
     */
    public get pitch():number
    {
        return Math.atan2( this.y, -this.z );
    }

    /**
     * The yaw angle in radians.
     * Yaw is the angle between the negative z-axis and the projection
     * of the vector onto the x-z plane. In other words, yaw represents
     * rotation around the y-axis. If the vector points to the right of
     * the negative z-axis, then the returned angle is between 0 and pi
     * radians (180 degrees); if it points to the left, the angle is
     * between 0 and -pi radians.
     *
     * @return The angle of this vector to the right or left of the negative z-axis.
     *
     */
    public get yaw():number
    {
        return Math.atan2( this.x, -this.z );
    }

    /**
     * The roll angle in radians.
     * Roll is the angle between the y-axis and the projection of the vector
     * onto the x-y plane. In other words, roll represents rotation around
     * the z-axis. If the vector points to the left of the y-axis, then the
     * returned angle is between 0 and pi radians (180 degrees); if it
     * points to the right, the angle is between 0 and -pi radians.
     *
     * Use this to roll angle of the plane to which this vector
     * is a normal. For example, if this vector represents the normal to
     * the palm, then this returns the tilt or roll of the palm
     * plane compared to the horizontal (x-z) plane.
     *
     * @return The angle of this vector to the right or left of the y-axis.
     *
     */
    public get roll():number
    {
        return Math.atan2( this.x, -this.y );
    }

    /**
     * The zero vector: (0, 0, 0)
     * @return
     *
     */
    public static zero():Vector3
    {
        return new Vector3( 0, 0, 0 );
    }

    /**
     * The x-axis unit vector: (1, 0, 0)
     * @return
     *
     */
    public static xAxis():Vector3
    {
        return new Vector3( 1, 0, 0 );
    }

    /**
     * The y-axis unit vector: (0, 1, 0)
     * @return
     *
     */
    public static yAxis():Vector3
    {
        return new Vector3( 0, 1, 0 );
    }

    /**
     * The z-axis unit vector: (0, 0, 1)
     * @return
     *
     */
    public static zAxis():Vector3
    {
        return new Vector3( 0, 0, 1 );
    }

    /**
     * The unit vector pointing left along the negative x-axis: (-1, 0, 0)
     * @return
     *
     */
    public static left():Vector3
    {
        return new Vector3( -1, 0, 0 );
    }

    /**
     * The unit vector pointing right along the positive x-axis: (1, 0, 0)
     * @return
     *
     */
    public static right():Vector3
    {
        return this.xAxis();
    }

    /**
     * The unit vector pointing down along the negative y-axis: (0, -1, 0)
     * @return
     *
     */
    public static down():Vector3
    {
        return new Vector3( 0, -1, 0 );
    }

    /**
     * The unit vector pointing up along the positive x-axis: (0, 1, 0)
     * @return
     *
     */
    public static up():Vector3
    {
        return this.yAxis();
    }

    /**
     * The unit vector pointing forward along the negative z-axis: (0, 0, -1)
     * @return
     *
     */
    public static forward():Vector3
    {
        return new Vector3( 0, 0, -1 );
    }

    /**
     * The unit vector pointing backward along the positive z-axis: (0, 0, 1)
     * @return
     *
     */
    public static backward():Vector3
    {
        return this.zAxis();
    }

    /**
     * Returns a string containing this vector in a human readable format: (x, y, z).
     * @return
     *
     */
    public toString():string
    {
        return "[Vector3 x:" + this.x + " y:" + this.y + " z:" + this.z + "]";
    }
}
