/// <reference path="./Vector3.ts"/>
/// <reference path="./Matrix.ts"/>
/**
 * The Bone class represents a tracked bone.
 *
 * <p>All fingers contain 4 bones that make up the anatomy of the finger.
 * Get valid Bone objects from a Finger object.</p>
 *
 * <p>Bones are ordered from base to tip, indexed from 0 to 3. Additionally,
 * the bone’s Type enum may be used to index a specific bone anatomically.</p>
 *
 * <p>The thumb does not have a base metacarpal bone and therefore contains
 * a valid, zero length bone at that location.</p>
 *
 * <p>Note that Bone objects can be invalid, which means that they do not
 * contain valid tracking data and do not correspond to a physical bone.
 * Invalid Bone objects can be the result of asking for a Bone object
 * from an invalid finger, indexing a bone out of range, or constructing
 * a new bone. Test for validity with the Bone::isValid() function.</p>
 *
 * @author logotype
 *
 */

/**
 * Enumerates the names of the bones.
 *
 * <p>Members of this enumeration are returned by Bone::type() to identify a
 * Bone object.</p>
 */
enum Type {
    /**
     * Bone connected to the wrist inside the palm
     */
    TYPE_METACARPAL = 0,

    /**
     * Bone connecting to the palm
     */
    TYPE_PROXIMAL = 1,

    /**
     * Bone between the tip and the base
     */
    TYPE_INTERMEDIATE = 2,

    /**
     * Bone at the tip of the finger
     */
    TYPE_DISTAL = 3
}

class Bone
{
    /**
     * The estimated length of the bone in millimeters.
     *
     * @returns The length of the bone in millimeters.
     * @since 2.0
     */
    public length:number;

    /**
     * The estimated width of the flesh around the bone in millimeters.
     *
     * @returns The width of the flesh around the bone in millimeters.
     * @since 2.0
     */
    public width:number;

    /**
     * The name of this bone.
     *
     * @returns The anatomical type of this bone as a member of the Bone::Type
     * enumeration.
     * @since 2.0
     */
    public type:number;

    /**
     * The base point the bone is anchored to.
     *
     * @returns The Vector containing the coordinates of the previous joint position.
     * @since 2.0
     */
    public prevJoint:Vector3;

    /**
     * The end point of the bone towards the tip direction.
     *
     * @returns The Vector containing the coordinates of the next joint position.
     * @since 2.0
     */
    public nextJoint:Vector3;

    /**
     * The orientation of the bone as a basis matrix.
     *
     * <p>The basis is defined as follows:
     *   xAxis: Clockwise rotation axis of the bone
     *   yAxis: Positive above the bone
     *   zAxis: Positive along the bone towards the wrist
     *
     * Note: Since the left hand is a mirror of the right hand, left handed
     * bones will contain a left-handed basis.</p>
     *
     * @returns The basis of the bone as a matrix.
     * @since 2.0
     */
    public basis:Matrix;

    /**
     * Constructs an invalid Bone object.
     *
     * <p>Get valid Bone objects from a Finger object.</p>
     */
    constructor()
    {
    }

    /**
     * The midpoint in the center of the bone.
     *
     * @returns The midpoint in the center of the bone.
     * @since 2.0
     */
    public center():Vector3
    {
        return LeapUtil.lerpVector( this.prevJoint, this.nextJoint, 0.5 );
    }

    /**
     * The normalized direction of the bone from base to tip.
     *
     * @returns The normalized direction of the bone from base to tip.
     * @since 2.0
     */
    public direction():Vector3
    {
        return new Vector3( this.basis.zBasis.x * -1, this.basis.zBasis.y * -1, this.basis.zBasis.z * -1 );
    }

    /**
     * Reports whether this is a valid Bone object.
     *
     * @returns True, if this Bone object contains valid tracking data.
     * @since 2.0
     */
    public isValid():Boolean
    {
        if( ( this.prevJoint && this.prevJoint.isValid() ) && ( this.nextJoint && this.nextJoint.isValid() ) )
            return true;

        return false;
    }

    /**
     * Compare Bone object equality/inequality.
     *
     * <p>Two Bone objects are equal if and only if both Bone
     * objects represent the exact same physical entities in
     * the same frame and both Bone objects are valid.</p>
     *
     * @param other The Bone to compare with.
     * @return True; if equal, False otherwise.
     *
     */
    public isEqualTo( other:Bone ):Boolean
    {
        if( !this.isValid() || !other.isValid() )
            return false;

        if( this.length != other.length )
            return false;

        if( this.width != other.width )
            return false;

        if( this.type != other.type )
            return false;

        if( this.prevJoint.isEqualTo( other.prevJoint ) )
            return false;

        if( this.nextJoint.isEqualTo( other.nextJoint ) )
            return false;

        return true;
    }

    /**
     * Returns an invalid Bone object.
     *
     * <p>You can use the instance returned by this in comparisons testing
     * whether a given Finger instance is valid or invalid. (You can also use the
     * Bone::isValid() function.)</p>
     *
     * @returns The invalid Bone instance.
     * @since 2.0
     */
    public static invalid():Bone
    {
        return new Bone();
    }

    /**
     * A string containing a brief, human readable description of the Pointable object.
     */
    public toString():String
    {
        return "[Bone direction: " + this.direction() + " type: " + this.type + " prevJoint: " + this.prevJoint + " nextJoint: " + this.nextJoint + "]";
    }
}
