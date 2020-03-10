/*
 * function looks in container with id for elements with a class named selectorClass.
 * Iterates over these elements and looks for data-event , data-funame pairs
 * 
 * <div id=id>
 * <button class='selectorClass' data-event='click' data-funame='objectOfFunctions.save'> Save  </button>
 * <button class='selectorClass' data-event='click' data-funame='objectOfFunctions.cancle'> Cancle </button>
 * <button class='selectorClass' data-event='click' data-funame='objectOfFunctions.copy'> Copy  </button>
 * </div>
 * 
 mapFunctions('id', '.selectorClass', objectOfFunctions);
 
 */

function mapFunctions(id, selectorClass, objectOfFunctions) {
    'use strict';
    var elements, obj;
    if (typeof id === 'string') {
        obj = document.getElementById(id);
    } else if (typeof id === 'object') {
        obj = id;
    } else {
        return;
    }
    if (obj === null) {
        return;
    }

    if (obj.classList.contains(selectorClass)) {
        mapFunc(obj);
    }
    elements = obj.querySelectorAll(selectorClass);
    elements.forEach(mapFunc);// iterate over list of DOM elements

    function mapFunc(element) { // handle one DOM  element
        var funameList = [], // array of function names
                eventList = [], // array of event names
                funame = ''; // a function name
        eventList = element.dataset.event ? element.dataset.event.split(',') : [];
        funameList = element.dataset.funame ? element.dataset.funame.split(',') : [];
        if (eventList.length === funameList.length) { // iterate over list of events for this DOM element
            eventList.forEach(function (event, i) {
                funame = funameList[i].split('.').pop(); // get last part of name 
                if (typeof objectOfFunctions[funame] !== 'undefined' && typeof objectOfFunctions[funame] === 'function') {
                    element.removeEventListener(event, objectOfFunctions[funame], false);
                    element.addEventListener(event, objectOfFunctions[funame], false); // attache function for this event
                }
            });
        }
    }
}

