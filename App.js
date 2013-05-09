define(["require", "exports"], function(require, exports) {
    (function (AppModule) {
        var App = (function () {
            function App() {
                var circleGesture = new Leap.CircleGesture();
                var controller = new Leap.Controller();
                var finger = new Leap.Finger();
                var frame = new Leap.Frame();
                var gesture = new Leap.Gesture();
                var hand = new Leap.Hand();
                var keyTapGesture = new Leap.KeyTapGesture();
                var pointable = new Leap.Pointable();
                var screenTapGesture = new Leap.ScreenTapGesture();
                var swipeGesture = new Leap.SwipeGesture();
                var tool = new Leap.Tool();
                var vector3 = new Leap.Vector3(0, 0, 0);
                var matrix = new Leap.Matrix(vector3, vector3, vector3);
            }
            return App;
        })();
        AppModule.App = App;        
    })(exports.AppModule || (exports.AppModule = {}));
    var AppModule = exports.AppModule;
})
//@ sourceMappingURL=App.js.map
