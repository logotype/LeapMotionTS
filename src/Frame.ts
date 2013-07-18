/// <reference path="./Vector3.ts"/>
/// <reference path="./Hand.ts"/>
/// <reference path="./InteractionBox.ts"/>
/// <reference path="./Pointable.ts"/>
/// <reference path="./Finger.ts"/>
/// <reference path="./Tool.ts"/>
/// <reference path="./Matrix.ts"/>
/// <reference path="./Gesture.ts"/>
/// <reference path="./Controller.ts"/>
/**
 * The Frame class represents a set of hand and finger tracking
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
class Frame
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
     * The current framerate (in frames per second) of the Leap Motion Controller.
     * <p>This value may fluctuate depending on available computing resources,
     * activity within the device field of view, software tracking settings,
     * and other factors.</p>
     * <p>An estimate of frames per second of the Leap Motion Controller.</p>
     */
    public currentFramesPerSecond:number;

    /**
     * The current InteractionBox for the frame.
     * <p>See the InteractionBox class documentation for more details on how this class should be used.</p>
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