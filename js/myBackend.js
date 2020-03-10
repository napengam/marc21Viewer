/* global eval */
GEVAL = {};
function myBackend(options) {
    'use strict';
    var
            request, payload, backendScript, respondAction, duration,
            requestQueue = [], timeOut = 0,
            setVeil = true, noQueue = false,
            veil = myVeil(), reveal = {};

    if (typeof options !== 'undefined') {
        options = Object.assign({'setVeil': true, 'noQueue': false}, options);
        setVeil = options.setVeil;
        noQueue = options.noQueue;
    }

    request = new XMLHttpRequest();
    if (!request || (request.readyState !== 4 && request.readyState !== 0)) {
        requestQueue.length = 0;
        return {};
    }
    function dummy() {
        return true;
    }
    //
    // send very first request imediatly
    // then requestQueue requests
    //
    function callBackend(backendScript, payload, respondAction) {
        if (respondAction === '') {
            respondAction = dummy;
        }
        requestQueue.push({
            'backendScript': backendScript,
            'payload': JSON.stringify(payload),
            'respondAction': respondAction,
            'duration': performance.now()
        });
        if (requestQueue.length === 1 || noQueue) {
            processRequest(); // very first request or no requestQueueing
        }
    }
    //
    // send request imediatly
    //
    function processRequest() {

        if (requestQueue.length === 0) {
            return;
        }
        //************************************************
        // process first request in requestQueue
        //************************************************
        payload = requestQueue[0].payload;
        respondAction = requestQueue[0].respondAction;
        backendScript = requestQueue[0].backendScript;
        duration = requestQueue[0].duration;

        request.open("POST", backendScript, true);
        request.setRequestHeader("Content-Type", "application/json");
        request.onreadystatechange = onChange;
        request.timeout = timeOut;
        request.ontimeout = timedOut;
        //
        // activate veil. to avoid any user interaction until request 
        // is finished or timed out;
        //   
        if (setVeil) {
            veil.veilOn();
        }
        request.send(payload);
    }
    function onChange() {
        var js;
        if (this.readyState === 4) {
            if (this.status === 200) {
                // request comes back, take away veil  to allow user action
                this.onreadystatechange = '';
                veil.veilOff();
                requestQueue.shift();
                try {
                    js = JSON.parse(this.responseText);
                } catch (e) {
                    respondAction({'error': '<div style="width:60%;word-wrap: break-word;">' + this.responseText + e.message + '</div>'});
                    processRequest();// process any remaining requests in requestQueue
                    return;
                }
                js.duration = performance.now() - duration;
                respondAction(js);
                processRequest();// process any remaining requests in requestQueue
            } else {
                requestQueue.shift();
                veil.veilOff();
                respondAction(JSON.parse(this.responseText));
                processRequest();// process any remaining requests in requestQueue
            }
        }
    }

    function sendNow(backEnd, sendPkg, respondAction) {
        var req;
        req = new XMLHttpRequest();
        req.open("POST", backEnd);
        req.setRequestHeader("Content-Type", "application/json");
        req.onreadystatechange = function () {
            var js;
            if (this.readyState === 4) {
                if (this.status === 200) {
                    // request comes back, take away veil  to allow user action
                    this.onreadystatechange = '';
                    try {
                        js = JSON.parse(this.responseText);
                    } catch (e) {
                        respondAction({'error': '<div style="width:60%;word-wrap: break-word;">' + this.responseText + e.message + '</div>'});
                        return;
                    }
                    js.duration = performance.now() - duration;
                    respondAction(js);
                } else {
                    respondAction(JSON.parse(this.responseText));
                }
            }
        };
        req.timeout = timeOut;
        req.ontimeout = timedOut;
        req.send(JSON.stringify(sendPkg));
    }
    function timedOut() {
        // request timed out, take away veil.;
        requestQueue.shift();
        veil.veilOff();
        request.abort();
        respondAction({'error': 'Backend script ' + backendScript + ' timed out after ' + timeOut + ' milliseconds: no responds '});
        processRequest();// process any remaining requests in requestQueue
    }

    function setTimeout(n) {
        timeOut = n;
    }
    function setNoQueue(flag) {
        noQueue = flag;
    }
    function useVeil(flag) {
        setVeil = flag;//  true || false
    }
    function fetchHTML(containerId, backendScript, payload, onDoneFunc) {
        //
        // containerId is the id of an html element to fill with content
        // delivered by the backendScript
        //
        payload.containerId = containerId;
        callBackend(backendScript, payload, getResponds);

        function getResponds(recPkg) {
            var dd, ls;
            if (recPkg.error === '') {
                dd = document.getElementById(recPkg.containerId);
                if (dd === null) {
                    return;
                }
            } else {
                dd = document.getElementById(containerId);
            }
            dd.innerHTML = '';
            dd.innerHTML = recPkg.error ? recPkg.error : recPkg.result;
            dd.style.display = 'block';
            //
            // here we look for CSS style sheet via link element
            //
            ls = dd.getElementsByTagName('LINK');
            [].forEach.call(ls, (l) => {
                if (l.type === 'text/css' && l.rel === 'stylesheet') {
                    includeCSS(l.href);
                }
            });
            //
            // here we look for and execute/load any given JavaScript              
            //
            GEVAL = eval; //eval in global scope
            ls = dd.getElementsByTagName('script');
            [].forEach.call(ls, (l) => {
                if (l.src === 'undefined' || l.src === '') {
                    GEVAL(l.innerHTML); // executes immediatly in global scope !!!
                } else {
                    includeJS(l.src); // this is evaluated later
                }
            });

            if (typeof onDoneFunc !== 'undefined' && typeof onDoneFunc === 'function') {
                //
                // call function when HTML is rendered
                //
                onDoneFunc();
            }
        }
    }

    function includeJS(file) {
        var i, heads, script, l = document.getElementsByTagName('SCRIPT');
        for (i = 0; i < l.length; i++) {
            if (l[i].src.indexOf(file) > 0) {
                return;
            }
        }
        script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', file);
        heads = document.getElementsByTagName('head');
        for (i = 0; i < heads.length; i++) {
            heads[i].appendChild(script);
        }
    }
    function includeCSS(path) {
        var i, link, heads, l = document.getElementsByTagName('LINK');
        for (i = 0; i < l.length; i++) {
            if (l[i].href.indexOf(path) > 0) {
                return;
            }
        }
        link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', path);
        heads = document.getElementsByTagName('head');
        for (i = 0; i < heads.length; i++) {
            heads[i].appendChild(link);
        }
    }
    //
    // these functions will be returned to the caller of this module
    //
    reveal = {
        useVeil: useVeil, // (true||false); default=true
        callBackend: callBackend, //(backendScriptScript, payload, respondAction)    
        setTimeout: setTimeout, //(milliSeconds) default=0
        setNoQueue: setNoQueue, //(true||false) default=true
        fetchHTML: fetchHTML, // (containerId, backendScript, payload, onDoneFunc)
        sendNow: sendNow //(backendScriptScript, payload, respondAction)    
    };
    return reveal;
}