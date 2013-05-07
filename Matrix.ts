/// <reference path="Vector3.ts"/>
import vectorModule = module('Vector3');
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
	public origin:vectorModule.Vector3 = new vectorModule.Vector3( 0, 0, 0 );

	/**
	 * The rotation and scale factors for the x-axis.
	 */
	public xBasis:vectorModule.Vector3 = new vectorModule.Vector3( 0, 0, 0 );

	/**
	 * The rotation and scale factors for the y-axis.
	 */
	public yBasis:vectorModule.Vector3 = new vectorModule.Vector3( 0, 0, 0 );

	/**
	 * The rotation and scale factors for the z-axis.
	 */
	public zBasis:vectorModule.Vector3 = new vectorModule.Vector3( 0, 0, 0 );

	/**
	 * Constructs a transformation matrix from the specified basis vectors. 
	 * @param x A Vector specifying rotation and scale factors for the x-axis.
	 * @param y A Vector specifying rotation and scale factors for the y-axis.
	 * @param z A Vector specifying rotation and scale factors for the z-axis.
	 * @param _origin A Vector specifying translation factors on all three axes.
	 * 
	 */
	constructor( x:vectorModule.Vector3, y:vectorModule.Vector3, z:vectorModule.Vector3, _origin:vectorModule.Vector3 = null )
	{
		this.xBasis = x;
		this.yBasis = y;
		this.zBasis = z;

		if ( _origin )
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
	public setRotation( _axis:vectorModule.Vector3, angleRadians:number ):void
	{
		var axis:vectorModule.Vector3 = _axis.normalized();
		var s:number = Math.sin( angleRadians );
		var c:number = Math.cos( angleRadians );
		var C:number = ( 1 - c );

		this.xBasis = new vectorModule.Vector3( axis.x * axis.x * C + c, axis.x * axis.y * C - axis.z * s, axis.x * axis.z * C + axis.y * s );
		this.yBasis = new vectorModule.Vector3( axis.y * axis.x * C + axis.z * s, axis.y * axis.y * C + c, axis.y * axis.z * C - axis.x * s );
		this.zBasis = new vectorModule.Vector3( axis.z * axis.x * C - axis.y * s, axis.z * axis.y * C + axis.x * s, axis.z * axis.z * C + c );
	}

	/**
	 * Transforms a vector with this matrix by transforming its rotation, scale, and translation.
	 * Translation is applied after rotation and scale.
	 * 
	 * @param inVector The Vector to transform.
	 * @return A new Vector representing the transformed original.
	 *
	 */
	public transformPoint( inVector:vectorModule.Vector3 ):vectorModule.Vector3
	{
		return new vectorModule.Vector3( this.xBasis.multiply( inVector.x ).x, this.yBasis.multiply( inVector.y ).y, this.zBasis.multiply( inVector.z ).z + this.origin.z );
	}

	/**
	 * Transforms a vector with this matrix by transforming its rotation and scale only.
	 * @param inVector The Vector to transform.
	 * @return A new Vector representing the transformed original.
	 *
	 */
	public transformDirection( inVector:vectorModule.Vector3 ):vectorModule.Vector3
	{
		return new vectorModule.Vector3( this.xBasis.multiply( inVector.x ).x, this.yBasis.multiply( inVector.y ).y, this.zBasis.multiply( inVector.z ).z );
	}

	/**
	 * Performs a matrix inverse if the matrix consists entirely of rigid transformations (translations and rotations).
	 * @return The rigid inverse of the matrix.
	 *
	 */
	public rigidInverse():Matrix
	{
		var rotInverse:Matrix = new Matrix( new vectorModule.Vector3( this.xBasis.x, this.yBasis.x, this.zBasis.x ), new vectorModule.Vector3( this.xBasis.y, this.yBasis.y, this.zBasis.y ), new vectorModule.Vector3( this.xBasis.z, this.yBasis.z, this.zBasis.z ) );
		if ( this.origin )
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
		return new Matrix( this.transformDirection( other.xBasis ), this.transformDirection( other.yBasis ), this.transformDirection( other.zBasis ), this.transformPoint( other.origin ) );
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
	public isEqualTo( other:Matrix ):bool
	{
		var returnValue:bool = true;

		if ( !this.xBasis.isEqualTo( other.xBasis ) )
			returnValue = false;

		if ( !this.yBasis.isEqualTo( other.yBasis ) )
			returnValue = false;

		if ( !this.zBasis.isEqualTo( other.zBasis ) )
			returnValue = false;

		if ( !this.origin.isEqualTo( other.origin ) )
			returnValue = false;

		return returnValue;
	}

	/**
	 * Returns the identity matrix specifying no translation, rotation, and scale.
	 * @return The identity matrix.
	 *
	 */
	static public identity():Matrix
	{
		var xBasis:vectorModule.Vector3 = new vectorModule.Vector3( 1, 0, 0 );
		var yBasis:vectorModule.Vector3 = new vectorModule.Vector3( 0, 1, 0 );
		var zBasis:vectorModule.Vector3 = new vectorModule.Vector3( 0, 0, 1 );

		return new Matrix( this.xBasis, this.yBasis, this.zBasis );
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