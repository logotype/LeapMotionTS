/// <reference path="./Pointable.ts"/>
/// <reference path="./Bone.ts"/>
/**
 * The Finger class represents a tracked finger.
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

/**
 * Enumerates the names of the fingers.
 *
 * <p>Members of this enumeration are returned by Finger::type() to identify a
 * Finger object.</p>
 *
 * @since 1.f
 */
enum Type {
    /**
     * The thumb.
     */
    TYPE_THUMB = 0,

    /**
     * The index or fore- finger.
     */
    TYPE_INDEX = 1,

    /**
     * The middle finger.
     */
    TYPE_MIDDLE = 2,

    /**
     * The ring finger.
     */
    TYPE_RING = 3,

    /**
     * The pinky or little finger.
     */
    TYPE_PINKY = 4
}

class Finger extends Pointable
{

    /**
     * The name of this finger.
     */
    public type:number;

    /**
     * The position of the distal interphalangeal joint of the finger.
     * This joint is closest to the tip.
     *
     * <p>The distal interphalangeal joint is located between the most extreme segment
     * of the finger (the distal phalanx) and the middle segment (the intermediate
     * phalanx).</p>
     */
    public dipPosition:Vector3;

    /**
     * The position of the proximal interphalangeal joint of the finger. This joint is the middle
     * joint of a finger.
     *
     * <p>The proximal interphalangeal joint is located between the two finger segments
     * closest to the hand (the proximal and the intermediate phalanges). On a thumb,
     * which lacks an intermediate phalanx, this joint index identifies the knuckle joint
     * between the proximal phalanx and the metacarpal bone.</p>
     */
    public pipPosition:Vector3;

    /**
     * The position of the metacarpopophalangeal joint, or knuckle, of the finger.
     *
     * <p>The metacarpopophalangeal joint is located at the base of a finger between
     * the metacarpal bone and the first phalanx. The common name for this joint is
     * the knuckle.</p>
     *
     * <p>On a thumb, which has one less phalanx than a finger, this joint index
     * identifies the thumb joint near the base of the hand, between the carpal
     * and metacarpal bones.</p>
     */
    public mcpPosition:Vector3;

    /**
     * Bone connected to the wrist inside the palm
     */
    public metacarpal:Bone;

    /**
     * Bone connecting to the palm
     */
    public proximal:Bone;

    /**
     * Bone between the tip and the base
     */
    public intermediate:Bone;

    /**
     * Bone at the tip of the finger
     */
    public distal:Bone;

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
     * The bone at a given bone index on this finger.
     *
     * @param boneIx An index value from the Bone::Type enumeration identifying the bone of interest.
     * @return The Bone that has the specified bone type.
     *
     * @since 1.f
     */
    public bone( boneIx:number ):Bone
    {
        switch( boneIx )
        {
            case Type.TYPE_METACARPAL:
                return this.metacarpal;
                break;
            case Type.TYPE_PROXIMAL:
                return this.proximal;
                break;
            case Type.TYPE_INTERMEDIATE:
                return this.intermediate;
                break;
            case Type.TYPE_DISTAL:
                return this.distal;
                break;
            default:
                return Bone.invalid();
                break;
        }
    }

    /**
     * The joint positions of this finger as a vector in the order base to tip.
     *
     * @return A Vector of joint positions.
     */
    public positions():Vector3[]
    {
        var positionsVector:Vector3[] = [];
        positionsVector.push(this.mcpPosition);
        positionsVector.push(this.pipPosition);
        positionsVector.push(this.dipPosition);
        positionsVector.push(this.tipPosition);

        return positionsVector;
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