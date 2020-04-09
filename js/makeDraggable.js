function makeDraggable(options) {
    'use strict';
    var opt, dragObj, handle, defaultOpt = {
        'dragObj': null, // object you want to drag
        'dragHandle': null, //  handle inside drag object 
        'allowY': true, // allow dragging allong Y-axis
        'allowX': true, // allow dragging allong X-axis
        'xmin': '0',
        'xmax': '',
        'ymin': '0',
        'ymax': ''
    };
    //**
    //merge caller options 
    //with default
    //***
    opt = Object.assign(defaultOpt, options);

    //**
    //locate object to be dragged
    //
    if (opt.dragObj === null) {
        return;
    } else if (typeof opt.dragObj === 'string') {
        dragObj = document.getElementById(opt.dragObj);
    } else {
        dragObj = opt.dragObj;
    }
    if (dragObj === null) {
        return;
    }
    //**
    //locate drag handle
    //***
    handle = locateElement(opt.dragHandle);
    if (handle === null) {
        return;
    }

    //**
    //turn dragabble on/off
    //***
    handle.addEventListener("mouseout", out, false);
    handle.addEventListener("mouseover", over, false);

    //**********
    //save options within drag object
    //and add eventhandlers for dragging 
    //but only once, because you can have more
    //then one drag handle inside drag object
    //***********
    dragObj.draggable = false;
    if (typeof dragObj.dragOption === 'undefined') {
        dragObj.dragOption = opt;
        dragObj.addEventListener("dragend", dragEnd, false);
        dragObj.addEventListener("dragstart", dragStart, false);
        dragObj.addEventListener("touchend", touchEnd, false);
        dragObj.addEventListener("touchmove", touchMove, false);
        dragObj.addEventListener("touchstart", touchStart, false);
    }
    //**
    //over or out of draghandle
    //***
    function over() {
        dragObj.draggable = true;
    }
    function out() {
        dragObj.draggable = false;
    }
    //**
    //save current position of
    //drag object on screen.
    //***
    function dragStart(event) {
        if (event.type !== 'dragstart' ||  dragObj.draggable===false) {
            return;
        }
        this.style.position = "fixed";
        this.style.zIndex = 60;
        event.dataTransfer.setData('text', ''); // to satisfy FF
        this.hgsX = event.screenX;
        this.hgsY = event.screenY;
        this.rect = dragObj.getBoundingClientRect();
        this.dragOption.xmin = 0;
        this.dragOption.xmax = window.innerWidth - this.rect.width;
        this.dragOption.ymin = 0;
        this.dragOption.ymax = window.innerHeight - this.rect.height;
    }

    //**
    //compute new position of drag
    //object, respect options
    //***
    function dragEnd(event) {
        var newPos;
        if (event.type !== 'dragend' ||  dragObj.draggable===false) {
            return;
        }
        if (this.dragOption.allowY) {
            newPos = event.target.offsetTop + (event.screenY - this.hgsY);
            if (newPos < this.dragOption.ymin) {
                newPos = this.dragOption.ymin;
            } else if (newPos > this.dragOption.ymax) {
                newPos = this.dragOption.ymax;
            }
            this.style.top = newPos + 'px';
        }
        if (this.dragOption.allowX) {
            newPos = event.target.offsetLeft + (event.screenX - this.hgsX);
            if (newPos < this.dragOption.xmin) {
                newPos = this.dragOption.xmin;
            } else if (newPos > this.dragOption.xmax) {
                newPos = this.dragOption.xmax;
            }
            this.style.left = newPos + 'px';

        }

    }
    //*
    //For touch events. Touch devices do not show
    //an outline image while dragging an object, therefore
    //we reposition the object along the touchpoint movement 
    //***

    function touchStart(event) {
        //**
        //need to know if a drag handle is touched.
        //For this we ask for a specific class 
        //in the object being touched. 
        //***
        if (event.target.classList.contains("dialogDrag4711")) {
            this.style.position = "fixed";
            this.draggable = true;
            this.hgsX = event.changedTouches[0].screenX;
            this.hgsY = event.changedTouches[0].screenY;
            this.hgsposX = this.offsetLeft;
            this.hgsposY = this.offsetTop;
        }
    }
    function touchMove(event) {
        if (this.draggable === false) {
            return;
        }
        event.stopPropagation();
        event.preventDefault();
        checkSetTouchPosition(this, event);
    }
    function touchEnd(event) {
        if (this.draggable === false) {
            return;
        }
        this.draggable = false;
        checkSetTouchPosition(this, event);
    }
    function checkSetTouchPosition(t, e) {
        if (t.dragOption.allowY) {
            t.style.top = t.hgsposY + (e.changedTouches[0].screenY - t.hgsY) + 'px';
        }
        if (t.dragOption.allowX) {
            t.style.left = t.hgsposX + (e.changedTouches[0].screenX - t.hgsX) + 'px';
        }
    }
    function locateElement(withThis) {
        var obj;
        if (typeof withThis === 'string') {
            obj = document.getElementById(withThis);
        } else {
            obj = withThis;
        }
        return obj;
    }
}