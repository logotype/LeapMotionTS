var vectorModule = require('./Vector3')
var Matrix = (function () {
    function Matrix(x, y, z, _origin) {
        if (typeof _origin === "undefined") { _origin = null; }
        this.origin = new vectorModule.Vector3(0, 0, 0);
        this.xBasis = new vectorModule.Vector3(0, 0, 0);
        this.yBasis = new vectorModule.Vector3(0, 0, 0);
        this.zBasis = new vectorModule.Vector3(0, 0, 0);
        this.xBasis = x;
        this.yBasis = y;
        this.zBasis = z;
        if(_origin) {
            this.origin = _origin;
        }
    }
    Matrix.prototype.setRotation = function (_axis, angleRadians) {
        var axis = _axis.normalized();
        var s = Math.sin(angleRadians);
        var c = Math.cos(angleRadians);
        var C = (1 - c);
        this.xBasis = new vectorModule.Vector3(axis.x * axis.x * C + c, axis.x * axis.y * C - axis.z * s, axis.x * axis.z * C + axis.y * s);
        this.yBasis = new vectorModule.Vector3(axis.y * axis.x * C + axis.z * s, axis.y * axis.y * C + c, axis.y * axis.z * C - axis.x * s);
        this.zBasis = new vectorModule.Vector3(axis.z * axis.x * C - axis.y * s, axis.z * axis.y * C + axis.x * s, axis.z * axis.z * C + c);
    };
    Matrix.prototype.transformPoint = function (inVector) {
        return new vectorModule.Vector3(this.xBasis.multiply(inVector.x).x, this.yBasis.multiply(inVector.y).y, this.zBasis.multiply(inVector.z).z + this.origin.z);
    };
    Matrix.prototype.transformDirection = function (inVector) {
        return new vectorModule.Vector3(this.xBasis.multiply(inVector.x).x, this.yBasis.multiply(inVector.y).y, this.zBasis.multiply(inVector.z).z);
    };
    Matrix.prototype.rigidInverse = function () {
        var rotInverse = new Matrix(new vectorModule.Vector3(this.xBasis.x, this.yBasis.x, this.zBasis.x), new vectorModule.Vector3(this.xBasis.y, this.yBasis.y, this.zBasis.y), new vectorModule.Vector3(this.xBasis.z, this.yBasis.z, this.zBasis.z));
        if(this.origin) {
            rotInverse.origin = rotInverse.transformDirection(this.origin.opposite());
        }
        return rotInverse;
    };
    Matrix.prototype.multiply = function (other) {
        return new Matrix(this.transformDirection(other.xBasis), this.transformDirection(other.yBasis), this.transformDirection(other.zBasis), this.transformPoint(other.origin));
    };
    Matrix.prototype.multiplyAssign = function (other) {
        this.xBasis = this.transformDirection(other.xBasis);
        this.yBasis = this.transformDirection(other.yBasis);
        this.zBasis = this.transformDirection(other.zBasis);
        this.origin = this.transformPoint(other.origin);
        return this;
    };
    Matrix.prototype.isEqualTo = function (other) {
        var returnValue = true;
        if(!this.xBasis.isEqualTo(other.xBasis)) {
            returnValue = false;
        }
        if(!this.yBasis.isEqualTo(other.yBasis)) {
            returnValue = false;
        }
        if(!this.zBasis.isEqualTo(other.zBasis)) {
            returnValue = false;
        }
        if(!this.origin.isEqualTo(other.origin)) {
            returnValue = false;
        }
        return returnValue;
    };
    Matrix.identity = function identity() {
        var xBasis = new vectorModule.Vector3(1, 0, 0);
        var yBasis = new vectorModule.Vector3(0, 1, 0);
        var zBasis = new vectorModule.Vector3(0, 0, 1);
        return new Matrix(this.xBasis, this.yBasis, this.zBasis);
    };
    Matrix.prototype.toString = function () {
        return "[Matrix xBasis:" + this.xBasis.toString() + " yBasis:" + this.yBasis.toString() + " zBasis:" + this.zBasis.toString() + " origin:" + this.origin.toString() + "]";
    };
    return Matrix;
})();
exports.Matrix = Matrix;
