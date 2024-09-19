"use strict";

/* Library ********************************************************************/
/******************************************************************************/

/* @-<addClass ****************************************************************/
/******************************************************************************/
function addClass($element, targetClass) {
    if (hasClass($element, targetClass) === false) {
        $element.className += " " + targetClass;
    }
}

/* @-<disableScroll ***********************************************************/
/******************************************************************************/
function disableScroll() {
    if (window.addEventListener) // older FF
    {
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    }

    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove = preventDefault; // mobile
    document.onkeydown = preventDefaultForScrollKeys;
}

/* @-<enableScroll ************************************************************/
/******************************************************************************/
function enableScroll() {
    if (window.removeEventListener) {
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    }

    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
}

/* @isWithinRange *************************************************************/
/******************************************************************************/
function isWithinRange(value, min, max) {
    if (value >= min && value <= max) {
        return true;
    } else {
        return false;
    }
}

/* @hasClass ******************************************************************/
/******************************************************************************/
function hasClass($element, targetClass) {
    var rgx = new RegExp("(?:^|\\s)" + targetClass + "(?!\\S)", "g");

    if ($element.className.match(rgx)) {
        return true;
    } else {
        return false;
    }
}

/* @-<massAddEventListener ****************************************************/
/******************************************************************************/
function massAddEventListener($elements, event, customFunction, useCapture) {
    var useCapture = useCapture || false;

    for (var i = 0; i < $elements.length; i++) {
        $elements[i].addEventListener(event, customFunction, useCapture);
    }
}

/* @-<minMax ******************************************************************/
/******************************************************************************/
function minMax(value, min, max) {
    if (value < min) {
        value = min;
    } else if (value > max) {
        value = max;
    }

    return value;
}

/* @-<moveScaleElement ********************************************************/
/******************************************************************************/
function moveScaleElement($element, targetOffsetX, targetOffsetY, targetScale) {
    $element.style.cssText = "-moz-transform : translate(" + targetOffsetX + ", " + targetOffsetY + ") scale(" + targetScale + "); -ms-transform : translate(" + targetOffsetX + ", " + targetOffsetY + ") scale(" + targetScale + "); -o-transform : translate(" + targetOffsetX + ", " + targetOffsetY + ") scale(" + targetScale + "); -webkit-transform : translate(" + targetOffsetX + ", " + targetOffsetY + ") scale(" + targetScale + "); transform : translate3d(" + targetOffsetX + ", " + targetOffsetY + ", 0) scale3d(" + targetScale + ", " + targetScale + ", 1);";
}

/* @-<preventDefault **********************************************************/
/******************************************************************************/
function preventDefault(e) {
    e = e || window.event;

    if (e.preventDefault) {
        e.preventDefault();
    }

    e.returnValue = false;
}

/* @preventDefaultForScrollKeys ***********************************************/
/******************************************************************************/
function preventDefaultForScrollKeys(e) {
    var keys = {
        37: 1,
        38: 1,
        39: 1,
        40: 1
    };

    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

/* @removeClass ***************************************************************/
/******************************************************************************/
function removeClass($element, targetClass) {
    var rgx = new RegExp("(?:^|\\s)" + targetClass + "(?!\\S)", "g");

    $element.className = $element.className.replace(rgx, "");
}