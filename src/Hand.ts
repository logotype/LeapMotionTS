/// <reference path="./Vector3.ts"/>
/// <reference path="./Pointable.ts"/>
/// <reference path="./Finger.ts"/>
/// <reference path="./Tool.ts"/>
/// <reference path="./Matrix.ts"/>
/// <reference path="./Frame.ts"/>
/**
 * The Hand class reports the physical characteristics of a detected hand.
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
class Hand
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
     * The stabilized palm position of this Hand.
     * <p>Smoothing and stabilization is performed in order to make this value more suitable for interaction with 2D content.</p>
     * <p>A modified palm position of this Hand object with some additional smoothing and stabilization applied.</p>
     */
    public stabilizedPalmPosition:Vector3;

    /**
     * The duration of time this Hand has been visible to the Leap Motion Controller.
     * <p>The duration (in seconds) that this Hand has been tracked.</p>
     */
    public timeVisible:number;

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