
//************************************************
//  create a veil to block any interaction with page elements.
// A div is created that covers the entire inner  browser window
// in order to prevent any mouse events on  page elements
//************************************************

function myVeil() {
    var veil = null, keyDown, state = 'off',
            zIndexLow = -1, zIndexHeigh = 55, opacity = 0.2,
            snapObj = null, reveal = null, snapToSource = false;

    keyDown = window.onkyedown;

    //************************************************
    // do we already exist ?
    //************************************************
    veil = document.getElementById('veilVeil');
    if (veil) {
        return veil.selfFunctions;
    }
    //************************************************
    // create the div 
    //************************************************

    veil = document.createElement('DIV');
    veil.tabIndex = -1;
    veil.id = 'veilVeil';
    veil.style.width = '100%';
    veil.style.zIndex = zIndexLow;
    veil.style.background = 'rgba(255, 255, 255, 0.18)';
    veil.style.position = 'fixed';
    veil.style.top = '0px';
    veil.style.left = '0px';
    veil.style.opacity = opacity;
    veil.style.background = '';
    veil.style.height = window.innerHeight + 'px';
    document.body.appendChild(veil);


    function veilOn() {
        veil.style.height = window.innerHeight + 'px';
        veil.style.zIndex = zIndexHeigh;
        veil.tabIndex = 1;
        state = 'on';
        window.addEventListener('resize', trackInnerHeight, false);
        window.onkeydown = handleKeyDown;
    }

    function veilOff() {
        veil.style.height = window.innerHeight + 'px';
        veil.style.zIndex = zIndexLow;
        veil.tabIndex = -1;
        state = 'off';
        window.removeEventListener('resize', trackInnerHeight, false);
        window.onkeydown = keyDown;
        veil.style.opacity = 0;
        veil.style.backgroundColor = '';
    }
    function veilAllOff() {

        if (snapObj) {
            snapObj.style.display = 'none';
            snapObj = null;
        }
        veilOff();
    }
    function veilSnapToCenter(obj) {
        //************************************************
        // snap given object, usualy a dialogbox,  to the
        //  center of the vail and above itself, or close to the
        //  event source that triggert the dialog
        //************************************************
        var ow, oh, ww, wh;

        ow = obj.clientWidth;
        oh = obj.clientHeight;
        ww = veil.style.height = window.innerWidth;
        wh = veil.style.height = window.innerHeight;
        obj.style.display = 'inline-block';
        obj.style.position = 'fixed';
        if (snapToSource === false) {// to center
            obj.style.top = (wh / 2 - oh / 2) + 'px';
            obj.style.left = (ww / 2 - ow / 2) + 'px';
        } else {// to close to event source
            obj.style.top = window.event.pageY + 30 + 'px';
            obj.style.left = window.event.pageX + 30 + 'px';
        }
        obj.style.zIndex = parseInt(veil.style.zIndex, 10) + 1;
        if (obj.style.zIndex * 1 === 0) {
            obj.style.zIndex = 55;
        }
        snapObj = obj;
        if (state === 'on') {
            veil.style.opacity = 0.5;
            veil.style.backgroundColor = 'white';
        }
        obj.style.visibility = 'visible';
    }
    function veilSnaptoSource(v) {
        snapToSource = v;
    }
    //
    //************************************************
    // function to  take care of window resize event
    //************************************************

    function trackInnerHeight() {
        if (state === 'on') {
            veil.style.height = window.innerHeight + 'px';
        }
        veilSnapToCenter(snapObj);
    }
    //*
    //* Block  TAB,  Shift-Tab 
    // 
    function handleKeyDown(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 9) {
            e.stopPropagation();
            e.preventDefault();
        }
    }
    //******************
    // reveal these functions to caller
    //*****************/

    reveal = {
        veil: function () {// expose the veil object 
            return veil;
        }(),
        veilOn: veilOn, //()
        veilOff: veilOff, //()
        veilAllOff: veilAllOff,
        veilSnapToCenter: veilSnapToCenter, //(obj)
        veilSnapToSource: veilSnaptoSource //(true|false=default);
    };
    //******************
    // save revealed function with 
    // self
    //*****************/
    veil.selfFunctions = reveal;
    return reveal;
}