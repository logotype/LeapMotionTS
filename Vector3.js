var Leap;
(function (Leap) {
    var Vector3 = (function () {
        function Vector3(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        Vector3.prototype.opposite = function () {
            return new Vector3(-this.x, -this.y, -this.z);
        };
        Vector3.prototype.plus = function (other) {
            return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
        };
        Vector3.prototype.plusAssign = function (other) {
            this.x += other.x;
            this.y += other.y;
            this.z += other.z;
            return this;
        };
        Vector3.prototype.minus = function (other) {
            return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
        };
        Vector3.prototype.minusAssign = function (other) {
            this.x -= other.x;
            this.y -= other.y;
            this.z -= other.z;
            return this;
        };
        Vector3.prototype.multiply = function (scalar) {
            return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
        };
        Vector3.prototype.multiplyAssign = function (scalar) {
            this.x *= scalar;
            this.y *= scalar;
            this.z *= scalar;
            return this;
        };
        Vector3.prototype.divide = function (scalar) {
            return new Vector3(this.x / scalar, this.y / scalar, this.z / scalar);
        };
        Vector3.prototype.divideAssign = function (scalar) {
            this.x /= scalar;
            this.y /= scalar;
            this.z /= scalar;
            return this;
        };
        Vector3.prototype.isEqualTo = function (other) {
            var returnValue;
            if(this.x != other.x || this.y != other.y || this.z != other.z) {
                returnValue = false;
            } else {
                returnValue = true;
            }
            return returnValue;
        };
        Vector3.prototype.angleTo = function (other) {
            var denom = this.magnitudeSquared() * other.magnitudeSquared();
            if(denom <= 0) {
                return 0;
            }
            return Math.acos(this.dot(other) / Math.sqrt(denom));
        };
        Vector3.prototype.cross = function (other) {
            return new Vector3((this.y * other.z) - (this.z * other.y), (this.z * other.x) - (this.x * other.z), (this.x * other.y) - (this.y * other.x));
        };
        Vector3.prototype.distanceTo = function (other) {
            return Math.sqrt((this.x - other.x) * (this.x - other.x) + (this.y - other.y) * (this.y - other.y) + (this.z - other.z) * (this.z - other.z));
        };
        Vector3.prototype.dot = function (other) {
            return (this.x * other.x) + (this.y * other.y) + (this.z * other.z);
        };
        Vector3.prototype.isValid = function () {
            return (this.x <= Number.MAX_VALUE && this.x >= -Number.MAX_VALUE) && (this.y <= Number.MAX_VALUE && this.y >= -Number.MAX_VALUE) && (this.z <= Number.MAX_VALUE && this.z >= -Number.MAX_VALUE);
        };
        Vector3.invalid = function invalid() {
            return new Vector3(NaN, NaN, NaN);
        };
        Vector3.prototype.magnitude = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        };
        Vector3.prototype.magnitudeSquared = function () {
            return this.x * this.x + this.y * this.y + this.z * this.z;
        };
        Vector3.prototype.normalized = function () {
            var denom = this.magnitudeSquared();
            if(denom <= 0) {
                return new Vector3(0, 0, 0);
            }
            denom = 1 / Math.sqrt(denom);
            return new Vector3(this.x * denom, this.y * denom, this.z * denom);
        };
        Vector3.prototype.pitch = function () {
            return Math.atan2(this.y, -this.z);
        };
        Vector3.prototype.yaw = function () {
            return Math.atan2(this.x, -this.z);
        };
        Vector3.prototype.roll = function () {
            return Math.atan2(this.x, -this.y);
        };
        Vector3.zero = function zero() {
            return new Vector3(0, 0, 0);
        };
        Vector3.xAxis = function xAxis() {
            return new Vector3(1, 0, 0);
        };
        Vector3.yAxis = function yAxis() {
            return new Vector3(0, 1, 0);
        };
        Vector3.zAxis = function zAxis() {
            return new Vector3(0, 0, 1);
        };
        Vector3.left = function left() {
            return new Vector3(-1, 0, 0);
        };
        Vector3.right = function right() {
            return Vector3.xAxis();
        };
        Vector3.down = function down() {
            return new Vector3(0, -1, 0);
        };
        Vector3.up = function up() {
            return Vector3.yAxis();
        };
        Vector3.forward = function forward() {
            return new Vector3(0, 0, -1);
        };
        Vector3.backward = function backward() {
            return Vector3.zAxis();
        };
        Vector3.prototype.toString = function () {
            return "[Vector3 x:" + this.x + " y:" + this.y + " z:" + this.z + "]";
        };
        return Vector3;
    })();
    Leap.Vector3 = Vector3;    
})(Leap || (Leap = {}));
//@ sourceMappingURL=Vector3.js.map
