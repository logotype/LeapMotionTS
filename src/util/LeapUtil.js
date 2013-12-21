/// <reference path="./../Vector3.ts"/>
/// <reference path="./../Matrix.ts"/>
/**
* LeapUtil is a collection of static utility functions.
*
*/
var LeapUtil = (function () {
    function LeapUtil() {
    }
    /**
    * Convert an angle measure from radians to degrees.
    *
    * @param radians
    * @return The value, in degrees.
    *
    */
    LeapUtil.toDegrees = function (radians) {
        return radians * 180 / Math.PI;
    };

    /**
    * Determines if a value is equal to or less than 0.00001.
    *
    * @return True, if equal to or less than 0.00001; false otherwise.
    */
    LeapUtil.isNearZero = function (value) {
        return Math.abs(value) <= LeapUtil.EPSILON;
    };

    /**
    * Determines if all Vector3 components is equal to or less than 0.00001.
    *
    * @return True, if equal to or less than 0.00001; false otherwise.
    */
    LeapUtil.vectorIsNearZero = function (inVector) {
        return this.isNearZero(inVector.x) && this.isNearZero(inVector.y) && this.isNearZero(inVector.z);
    };

    /**
    * Create a new matrix with just the rotation block from the argument matrix
    */
    LeapUtil.extractRotation = function (mtxTransform) {
        return new Matrix(mtxTransform.xBasis, mtxTransform.yBasis, mtxTransform.zBasis);
    };

    /**
    * Returns a matrix representing the inverse rotation by simple transposition of the rotation block.
    */
    LeapUtil.rotationInverse = function (mtxRot) {
        return new Matrix(new Vector3(mtxRot.xBasis.x, mtxRot.yBasis.x, mtxRot.zBasis.x), new Vector3(mtxRot.xBasis.y, mtxRot.yBasis.y, mtxRot.zBasis.y), new Vector3(mtxRot.xBasis.z, mtxRot.yBasis.z, mtxRot.zBasis.z));
    };

    /**
    * Returns a matrix that is the orthonormal inverse of the argument matrix.
    * This is only valid if the input matrix is orthonormal
    * (the basis vectors are mutually perpendicular and of length 1)
    */
    LeapUtil.rigidInverse = function (mtxTransform) {
        var rigidInverse = this.rotationInverse(mtxTransform);
        rigidInverse.origin = rigidInverse.transformDirection(mtxTransform.origin.opposite());
        return rigidInverse;
    };

    LeapUtil.componentWiseMin = function (vLHS, vRHS) {
        return new Vector3(Math.min(vLHS.x, vRHS.x), Math.min(vLHS.y, vRHS.y), Math.min(vLHS.z, vRHS.z));
    };

    LeapUtil.componentWiseMax = function (vLHS, vRHS) {
        return new Vector3(Math.max(vLHS.x, vRHS.x), Math.max(vLHS.y, vRHS.y), Math.max(vLHS.z, vRHS.z));
    };

    LeapUtil.componentWiseScale = function (vLHS, vRHS) {
        return new Vector3(vLHS.x * vRHS.x, vLHS.y * vRHS.y, vLHS.z * vRHS.z);
    };

    LeapUtil.componentWiseReciprocal = function (inVector) {
        return new Vector3(1.0 / inVector.x, 1.0 / inVector.y, 1.0 / inVector.z);
    };

    LeapUtil.minComponent = function (inVector) {
        return Math.min(inVector.x, Math.min(inVector.y, inVector.z));
    };

    LeapUtil.maxComponent = function (inVector) {
        return Math.max(inVector.x, Math.max(inVector.y, inVector.z));
    };

    /**
    * Compute the polar/spherical heading of a vector direction in z/x plane
    */
    LeapUtil.heading = function (inVector) {
        return Math.atan2(inVector.z, inVector.x);
    };

    /**
    * Compute the spherical elevation of a vector direction in y above the z/x plane
    */
    LeapUtil.elevation = function (inVector) {
        return Math.atan2(inVector.y, Math.sqrt(inVector.z * inVector.z + inVector.x * inVector.x));
    };

    /**
    * Set magnitude to 1 and bring heading to [-Pi,Pi], elevation into [-Pi/2, Pi/2]
    *
    * @param vSpherical The Vector3 to convert.
    * @return The normalized spherical Vector3.
    *
    */
    LeapUtil.normalizeSpherical = function (vSpherical) {
        var fHeading = vSpherical.y;
        var fElevation = vSpherical.z;

        while (fElevation <= -Math.PI)
            fElevation += LeapUtil.TWO_PI;
        while (fElevation > Math.PI)
            fElevation -= LeapUtil.TWO_PI;

        if (Math.abs(fElevation) > LeapUtil.HALF_PI) {
            fHeading += Math.PI;
            fElevation = fElevation > 0 ? (Math.PI - fElevation) : -(Math.PI + fElevation);
        }

        while (fHeading <= -Math.PI)
            fHeading += LeapUtil.TWO_PI;
        while (fHeading > Math.PI)
            fHeading -= LeapUtil.TWO_PI;

        return new Vector3(1, fHeading, fElevation);
    };

    /**
    * Convert from Cartesian (rectangular) coordinates to spherical coordinates
    * (magnitude, heading, elevation).
    *
    * @param vCartesian The Vector3 to convert.
    * @return The cartesian Vector3 converted to spherical.
    *
    */
    LeapUtil.cartesianToSpherical = function (vCartesian) {
        return new Vector3(vCartesian.magnitude(), this.heading(vCartesian), this.elevation(vCartesian));
    };

    /**
    * Convert from spherical coordinates (magnitude, heading, elevation) to
    * Cartesian (rectangular) coordinates.
    *
    * @param vSpherical The Vector3 to convert.
    * @return The spherical Vector3 converted to cartesian.
    *
    */
    LeapUtil.sphericalToCartesian = function (vSpherical) {
        var fMagnitude = vSpherical.x;
        var fCosHeading = Math.cos(vSpherical.y);
        var fSinHeading = Math.sin(vSpherical.y);
        var fCosElevation = Math.cos(vSpherical.z);
        var fSinElevation = Math.sin(vSpherical.z);

        return new Vector3(fCosHeading * fCosElevation * fMagnitude, fSinElevation * fMagnitude, fSinHeading * fCosElevation * fMagnitude);
    };

    /**
    * Clamps a value between a minimum Number and maximum Number value.
    *
    * @param inVal The number to clamp.
    * @param minVal The minimum value.
    * @param maxVal The maximum value.
    * @return The value clamped between minVal and maxVal.
    *
    */
    LeapUtil.clamp = function (inVal, minVal, maxVal) {
        return (inVal < minVal) ? minVal : ((inVal > maxVal) ? maxVal : inVal);
    };

    /**
    * Linearly interpolates between two Numbers.
    *
    * @param a A number.
    * @param b A number.
    * @param coefficient The interpolation coefficient [0-1].
    * @return The interpolated number.
    *
    */
    LeapUtil.lerp = function (a, b, coefficient) {
        return a + ((b - a) * coefficient);
    };

    /**
    * Linearly interpolates between two Vector3 objects.
    *
    * @param vec1 A Vector3 object.
    * @param vec2 A Vector3 object.
    * @param coefficient The interpolation coefficient [0-1].
    * @return A new interpolated Vector3 object.
    *
    */
    LeapUtil.lerpVector = function (vec1, vec2, coefficient) {
        return vec1.plus(vec2.minus(vec1).multiply(coefficient));
    };
    LeapUtil.PI = 3.1415926536;

    LeapUtil.DEG_TO_RAD = 0.0174532925;

    LeapUtil.RAD_TO_DEG = 57.295779513;

    LeapUtil.TWO_PI = Math.PI + Math.PI;

    LeapUtil.HALF_PI = Math.PI * 0.5;

    LeapUtil.EPSILON = 0.00001;
    return LeapUtil;
})();
//# sourceMappingURL=LeapUtil.js.map
