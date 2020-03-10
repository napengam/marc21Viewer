/* global set, dialogs, backend, pager, pager */

function marcF() {
    'use strict';
    var lastFile, reveal = {};

    function init() {
        pager.file = '../mrc/Atest.mrc';// just to test as default
        pager.rpv = 25;
        settings();
    }

    function settings() {

        //********************************************
        //  ask for parameters
        //*******************************************
        dialogs.closeDialog();
        backend.callBackend('../php_marc/settings.php', pager, (recPkg) => {
            mapFunctions(dialogs.myEmptyDialog(recPkg.result), '.findMe', reveal);
        });
    }
    function keyup(e) {
        if (e.type === 'keyup' && e.keyCode === 13) {
            saveSettings();
        }
        return;
    } 
    function saveSettings() {
        //********************************************
        //  save 
        //*******************************************
        var error = 0, vlist, obj = document.getElementById('mvsettings');
        dialogs.closeDialog();
        vlist = obj.querySelectorAll('INPUT');
        vlist.forEach((elem) => {
            elem.style.color = '';
            pager[elem.name] = elem.value.trim();
            if (elem.dataset.type === 'n' && isNaN(elem.value)) {
                error++;
                elem.style.color = 'red';
            }
        });
        if (error === 0 && pager.file !== '') {
            if (lastFile !== pager.file) {
                lastFile = pager.file;
                pager.current = 0;
                dialogs.closeDialog();
                dialogs.myInform('Scaning; Just a second <br><i class="fas fa-spinner fa-spin"></i>');
                //********************************************
                //  analyse marc file
                //*******************************************
                backend.callBackend('../php_marc/scanMarc.php', {'file': pager.file}, firstScan);
            } else {
                makePage();
            }
        }
    }
    function firstScan(resPkg) {
        if (resPkg.error) {
            dialogs.myAlert(resPkg.error);
            return;
        }
        allOffsets = resPkg.result;
        makePage();
    }

    function makePage() {

        //*******************************************
        var payload = {}, i, n, nmax, sth;
        payload = Object.assign(payload, pager);
        payload.get = [];
        if (payload.recnum > 0) {
            pager.current = payload.current = payload.recnum;
            nmax = 1;
            pager.recnum = 0;
            payload.rpv = 1;
        } else {
            nmax = pager.rpv;
            payload.current = pager.current * 1;
        }

        //********************************************
        //  get first page of records
        //*******************************************


        if (pager.current >= allOffsets.length) {
            return;
        }
        for (i = pager.current, n = 0; i < allOffsets.length && n < nmax; i++) {
            payload.get.push(allOffsets[i]);
            n++;
            pager.current++;
        }

        dialogs.myInform('Get a page; Just a second <br><i class="fas fa-spinner fa-spin"></i>');
        backend.fetchHTML('contentTarget', '../php_marc/makeMarcPage.php', payload, () => {
            dialogs.closeDialog();
            sth = stickyHead('t1', {ncpth: [1, 4], nccol: 4, topDif: 'headdivHGS', leftDif: 0});
            sth.scrollBody();
        });
    }
    function makeNextPage() {
        makePage();
    }
    function makePrevPage() {
        pager.current = pager.current - 2 * pager.rpv;
        pager.current < 0 ? pager.current = 0 : '';
        makePage();
    }
    function makeFirstPage() {
        pager.current = 0;
        makePage();
    }
    function makeLastPage() {
        pager.current = allOffsets.length - pager.rpv;
        makePage();
    }
    function fontSizeUp() {
        var now;
        now = parseFloat(document.body.parentNode.style.fontSize, 10);
        if (now === 0.0 || isNaN(now)) {
            document.body.parentNode.style.fontSize = '1.1rem';
        } else {
            now = now + 0.1;
            document.body.parentNode.style.fontSize = now + 'rem';
        }
        pageItemAdjust();
    }
    function fontSizeDown() {
        var now;
        now = parseFloat(document.body.parentNode.style.fontSize, 10);
        if (now === 0.0 || isNaN(now)) {
            document.body.parentNode.style.fontSize = '0.9rem';
        } else {
            now = now - 0.1;
            document.body.parentNode.style.fontSize = now + 'rem';
        }
        pageItemAdjust();
    }
    reveal = {
        init: init,
        settings: settings,
        saveSettings: saveSettings,
        makeNextPage: makeNextPage,
        makePrevPage: makePrevPage,
        makeFirstPage: makeFirstPage,
        makeLastPage: makeLastPage,
        keyup: keyup,
        fontSizeUp: fontSizeUp,
        fontSizeDown: fontSizeDown
    };
    return reveal;
}
