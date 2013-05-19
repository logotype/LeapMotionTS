/// <reference path="./../Vector3.ts"/>
/// <reference path="./../Matrix.ts"/>
/**
 * LeapUtil is a collection of static utility functions.
 *
 */
class LeapUtil
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