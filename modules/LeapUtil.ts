/// <reference path="Vector3.ts"/>
/// <reference path="Matrix.ts"/>
/**
 * LeapUtil is a collection of static utility functions.
 *
 */
export class LeapUtil
{
    /** The constant pi as a single precision floating point number. */
    static public PI:number = 3.1415926536;

    /**
     * The constant ratio to convert an angle measure from degrees to radians.
     * Multiply a value in degrees by this constant to convert to radians.
     */
    static public DEG_TO_RAD:number = 0.0174532925;

    /**
     * The constant ratio to convert an angle measure from radians to degrees.
     * Multiply a value in radians by this constant to convert to degrees.
     */
    static public RAD_TO_DEG:number = 57.295779513;

    /**
     * Pi &#42; 2.
     */
    static public TWO_PI:number = Math.PI + Math.PI;

    /**
     * Pi &#42; 0.5.
     */
    static public HALF_PI:number = Math.PI * 0.5;

    /**
     * Represents the smallest positive single value greater than zero.
     */
    static public EPSILON:number = 0.00001;

    public LeapUtil()
    {
    }

    /**
     * Convert an angle measure from radians to degrees.
     *
     * @param radians
     * @return The value, in degrees.
     *
     */
    static public toDegrees( radians:number ):number
    {
        return radians * 180 / Math.PI;
    }

    /**
     * Determines if a value is equal to or less than 0.00001.
     *
     * @return True, if equal to or less than 0.00001; false otherwise.
     */
    static public isNearZero( value:number ):Boolean
    {
        return Math.abs( value ) <= EPSILON;
    }

    /**
     * Determines if all Vector3 components is equal to or less than 0.00001.
     *
     * @return True, if equal to or less than 0.00001; false otherwise.
     */
    static public vectorIsNearZero( inVector:Leap.Vector3 ):Boolean
    {
        return isNearZero( inVector.x ) && isNearZero( inVector.y ) && isNearZero( inVector.z );
    }

    /**
     * Create a new matrix with just the rotation block from the argument matrix
     */
    static public extractRotation( mtxTransform:Leap.Matrix ):Leap.Matrix
    {
        return new Leap.Matrix( mtxTransform.xBasis, mtxTransform.yBasis, mtxTransform.zBasis );
    }

    /**
     * Returns a matrix representing the inverse rotation by simple transposition of the rotation block.
     */
    static public rotationInverse( mtxRot:Leap.Matrix ):Leap.Matrix
    {
        return new Leap.Matrix( new Leap.Vector3( mtxRot.xBasis.x, mtxRot.yBasis.x, mtxRot.zBasis.x ), new Leap.Vector3( mtxRot.xBasis.y, mtxRot.yBasis.y, mtxRot.zBasis.y ), new Leap.Vector3( mtxRot.xBasis.z, mtxRot.yBasis.z, mtxRot.zBasis.z ) );
    }

    /**
     * Returns a matrix that is the orthonormal inverse of the argument matrix.
     * This is only valid if the input matrix is orthonormal
     * (the basis vectors are mutually perpendicular and of length 1)
     */
    static public rigidInverse( mtxTransform:Leap.Matrix ):Leap.Matrix
    {
        var rigidInverse:Leap.Matrix = rotationInverse( mtxTransform );
        rigidInverse.origin = rigidInverse.transformDirection( mtxTransform.origin.opposite() );
        return rigidInverse;
    }

    static public componentWiseMin( vLHS:Leap.Vector3, vRHS:Leap.Vector3 ):Leap.Vector3
    {
        return new Leap.Vector3( Math.min( vLHS.x, vRHS.x ), Math.min( vLHS.y, vRHS.y ), Math.min( vLHS.z, vRHS.z ) );
    }

    static public componentWiseMax( vLHS:Leap.Vector3, vRHS:Leap.Vector3 ):Leap.Vector3
    {
        return new Leap.Vector3( Math.max( vLHS.x, vRHS.x ), Math.max( vLHS.y, vRHS.y ), Math.max( vLHS.z, vRHS.z ) );
    }

    static public componentWiseScale( vLHS:Leap.Vector3, vRHS:Leap.Vector3 ):Leap.Vector3
    {
        return new Leap.Vector3( vLHS.x * vRHS.x, vLHS.y * vRHS.y, vLHS.z * vRHS.z );
    }

    static public componentWiseReciprocal( inVector:Leap.Vector3 ):Leap.Vector3
    {
        return new Leap.Vector3( 1.0 / inVector.x, 1.0 / inVector.y, 1.0 / inVector.z );
    }

    static public minComponent( inVector:Leap.Vector3 ):number
    {
        return Math.min( inVector.x, Math.min( inVector.y, inVector.z ) );
    }

    static public maxComponent( inVector:Leap.Vector3 ):number
    {
        return Math.max( inVector.x, Math.max( inVector.y, inVector.z ) );
    }

    /**
     * Compute the polar/spherical heading of a vector direction in z/x plane
     */
    static public heading( inVector:Leap.Vector3 ):number
    {
        return Math.atan2( inVector.z, inVector.x );
    }

    /**
     * Compute the spherical elevation of a vector direction in y above the z/x plane
     */
    static public elevation( inVector:Leap.Vector3 ):number
    {
        return Math.atan2( inVector.y, Math.sqrt( inVector.z * inVector.z + inVector.x * inVector.x ) );
    }

    /**
     * Set magnitude to 1 and bring heading to [-Pi,Pi], elevation into [-Pi/2, Pi/2]
     *
     * @param The Vector3 to convert.
     * @return The normalized spherical Vector3.
     *
     */
    static public normalizeSpherical( vSpherical:Leap.Vector3 ):Leap.Vector3
    {
        var fHeading:number  = vSpherical.y;
        var fElevation:number = vSpherical.z;

        while ( fElevation <= -Math.PI ) fElevation += TWO_PI;
        while ( fElevation > Math.PI ) fElevation -= TWO_PI;

        if ( Math.abs( fElevation ) > HALF_PI )
        {
            fHeading += Math.PI;
            fElevation = fElevation > 0 ? ( Math.PI - fElevation ) : -( Math.PI + fElevation );
        }

        while ( fHeading <= -Math.PI ) fHeading += TWO_PI;
        while ( fHeading > Math.PI ) fHeading -= TWO_PI;

        return new Leap.Vector3( 1, fHeading, fElevation );
    }

    /**
     * Convert from Cartesian (rectangular) coordinates to spherical coordinates
     * (magnitude, heading, elevation).
     *
     * @param The Vector3 to convert.
     * @return The cartesian Vector3 converted to spherical.
     *
     */
    static public cartesianToSpherical( vCartesian:Leap.Vector3 ):Leap.Vector3
    {
        return new Leap.Vector3( vCartesian.magnitude(), heading( vCartesian ), elevation( vCartesian ) );
    }

    /**
     * Convert from spherical coordinates (magnitude, heading, elevation) to
     * Cartesian (rectangular) coordinates.
     *
     * @param The Vector3 to convert.
     * @return The spherical Vector3 converted to cartesian.
     *
     */
    static public sphericalToCartesian( vSpherical:Leap.Vector3 ):Leap.Vector3
    {
        var fMagnitude:number    = vSpherical.x;
        var fCosHeading:number   = Math.cos( vSpherical.y );
        var fSinHeading:number   = Math.sin( vSpherical.y );
        var fCosElevation:number = Math.cos( vSpherical.z );
        var fSinElevation:number = Math.sin( vSpherical.z );

        return new Leap.Vector3(  fCosHeading   * fCosElevation  * fMagnitude,
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
    static public clamp( inVal:number, minVal:number, maxVal:number ):number
    {
        return ( inVal < minVal ) ? minVal : (( inVal > maxVal ) ? maxVal : inVal );
    }

    /**
     * Linearly interpolates between two Numbers.
     *
     * @param a A number.
     * @param b A number.
     * @param t The interpolation coefficient [0-1].
     * @return The interpolated number.
     *
     */
    static public lerp( a:number, b:number, coefficient:number ):number
    {
        return a + ( ( b - a ) * coefficient );
    }

    /**
     * Linearly interpolates between two Vector3 objects.
     *
     * @param a A Vector3 object.
     * @param b A Vector3 object.
     * @param t The interpolation coefficient [0-1].
     * @return A new interpolated Vector3 object.
     *
     */
    static public lerpVector( vec1:Leap.Vector3, vec2:Leap.Vector3, coefficient:number ):Leap.Vector3
    {
        return vec1.plus( vec2.minus( vec1 ).multiply( coefficient ) );
    }
}
