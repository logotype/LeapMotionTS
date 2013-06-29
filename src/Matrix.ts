/// <reference path="./Vector3.ts"/>
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
class Matrix
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