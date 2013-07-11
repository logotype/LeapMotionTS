/// <reference path="./Vector3.ts"/>
/**
 * The InteractionBox class represents a box-shaped region completely within
 * the field of view of the Leap Motion controller.
 *
 * <p>The interaction box is an axis-aligned rectangular prism and provides
 * normalized coordinates for hands, fingers, and tools within this box.
 * The InteractionBox class can make it easier to map positions in the
 * Leap Motion coordinate system to 2D or 3D coordinate systems used
 * for application drawing.</p>
 *
 * <p>The InteractionBox region is defined by a center and dimensions along the x, y, and z axes.</p>
 *
 * @author logotype
 *
 */
class InteractionBox
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

        vec.x = ( normalizedPosition.x - 0.5 ) * this.width + this.center.x;
        vec.y = ( normalizedPosition.y - 0.5 ) * this.height + this.center.y;
        vec.z = ( normalizedPosition.z - 0.5 ) * this.depth + this.center.z;

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