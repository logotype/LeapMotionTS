import Leap = require('../build/leapmotionts-1.3.0+dev1');

function moveFinger(finger:HTMLDivElement, posX:number, posY:number, posZ:number, dirX:number, dirY:number, dirZ:number) {
    finger.style["webkitTransform"] = "translateX("+posX+"px) translateY("+posY+"px) translateZ("+posZ+"px) rotateX("+dirX+"deg) rotateY(0deg) rotateZ("+dirZ+"deg)";
}

function moveSphere(sphere:HTMLDivElement, posX:number, posY:number, posZ:number, rotX:number, rotY:number, rotZ:number) {
    sphere.style["webkitTransform"] = "translateX("+posX+"px) translateY("+posY+"px) translateZ("+posZ+"px) rotateX("+rotX+"deg) rotateY(0deg) rotateZ(0deg)";
}

var fingers:number[] = [];
var spheres:number[] = [];

var controller:Leap.Controller = new Leap.Controller();
controller.addEventListener( Leap.LeapEvent.LEAPMOTION_FRAME, ( event:Leap.LeapEvent ) => {
    var frame:Leap.Frame = event.frame;
    var fingerIds:boolean[] = [];
    var handIds:boolean[] = [];
    if (frame.hands === undefined ) {
        var handsLength = 0
    } else {
        var handsLength = frame.hands.length;
    }

    for (var handId:number = 0, handCount:number = handsLength; handId != handCount; handId++) {
        var hand:Leap.Hand = frame.hands[handId];
        var posX:number = (hand.palmPosition.x*3);
        var posY:number = (hand.palmPosition.z*3)-200;
        var posZ:number = (hand.palmPosition.y*3)-400;
        var rotX:number = (hand.rotation.xBasis.z*90);
        var rotY:number = (hand.rotation.xBasis.y*90);
        var rotZ:number = (hand.rotation.xBasis.x*90);
        var sphere:number = spheres[hand.id];
        console.log(hand.rotation.yBasis);
        if (!sphere) {
            var sphereDiv:HTMLDivElement = <HTMLDivElement>document.getElementById("sphere").cloneNode(true);
            sphereDiv.setAttribute('id',hand.id.toString());
            sphereDiv.style.backgroundColor='#'+Math.floor(Math.random()*16777215).toString(16);
            document.getElementById('scene').appendChild(sphereDiv);
            spheres[hand.id] = hand.id;
        } else {
            var sphereDiv:HTMLDivElement =  <HTMLDivElement>document.getElementById(hand.id.toString());
            if (typeof(sphereDiv) != 'undefined' && sphereDiv != null) {
                moveSphere(sphereDiv, posX, posY, posZ, rotX, rotY, rotZ);
            }
        }
        handIds[hand.id] = true;
    }
    for (var handIdSphere in spheres) {
        if (!handIds[handIdSphere]) {
            var sphereDiv:HTMLDivElement = <HTMLDivElement>document.getElementById(String(spheres[handIdSphere]));
            sphereDiv.parentNode.removeChild(sphereDiv);
            delete spheres[handIdSphere];
        }
    }

    for (var pointableId:number = 0, pointableCount:number = frame.pointables.length; pointableId != pointableCount; pointableId++) {
        var pointable:Leap.Pointable = frame.pointables[pointableId];
        var posX:number = (pointable.tipPosition.x*3);
        var posY:number = (pointable.tipPosition.z*3)-200;
        var posZ:number = (pointable.tipPosition.y*3)-400;
        var dirX:number = -(pointable.direction.y*90);
        var dirY:number = -(pointable.direction.z*90);
        var dirZ:number = (pointable.direction.x*90);
        var finger:number = fingers[pointable.id];
        if (!finger) {
            var fingerDiv:HTMLDivElement = <HTMLDivElement>document.getElementById("finger").cloneNode(true);
            fingerDiv.setAttribute('id',pointable.id.toString());
            fingerDiv.style.backgroundColor='#'+Math.floor(Math.random()*16777215).toString(16);
            document.getElementById('scene').appendChild(fingerDiv);
            fingers[pointable.id] = pointable.id;
        } else {
            var fingerDiv:HTMLDivElement =  <HTMLDivElement>document.getElementById(pointable.id.toString());
            if (typeof(fingerDiv) != 'undefined' && fingerDiv != null) {
                moveFinger(fingerDiv, posX, posY, posZ, dirX, dirY, dirZ);
            }
        }
        fingerIds[pointable.id] = true;
    }
    for (var fingerId in fingers) {
        if (!fingerIds[fingerId]) {
            var fingerDiv:HTMLDivElement =  <HTMLDivElement>document.getElementById(String(fingers[fingerId]));
            fingerDiv.parentNode.removeChild(fingerDiv);
            delete fingers[fingerId];
        }
    }
    document.getElementById('showHands').addEventListener('mousedown', function() {
        document.getElementById('app').setAttribute('class','show-hands');
    }, false);
    document.getElementById('hideHands').addEventListener('mousedown', function() {
        document.getElementById('app').setAttribute('class','');
    }, false);
});
