function pageItemAdjust() {
    'use strict';
    var observer, contentTarget = document.getElementById('contentTarget'),
            foot = document.getElementById('footerHGS'), init = false;

    if (foot) {
        /*
         * we have to add the footHeight to the height of the content
         * else vertical scrolling will not work correct
         */
        observer = new MutationObserver(function (mutations) {

            observer.disconnect();
            if (init === false) {
                init = true;
                contentTarget.style.height = contentTarget.clientHeight + foot.clientHeight + 'px';
                contentTarget.parentNode.style.height = contentTarget.clientHeight + foot.clientHeight + 'px';
            } else {
                contentTarget.style.height = contentTarget.parentNode.clientHeight + 'px';
                contentTarget.parentNode.style.height = '0px';
            }
            observer.observe(contentTarget, {subtree: true, childList: true, characterData: true});
        });
    }

    function moveContent() {

        var sideNav, head = document.getElementById('headdivHGS'),
                content = document.getElementById('contentDiv');

        content.style.visibility = 'hidden';
        if (head) {
            content.style.position = 'absolute';
            content.style.top = head.clientHeight + 'px';
            content.style.left = 0 + 'px';
        }
        sideNav = document.getElementById('sideNavHGS');
        if (sideNav) {
            if (sideNav.dataset.position === 'left') {
                content.style.position = 'absolute';
                content.style.left = sideNav.clientWidth + 'px';
                sideNav.style.position = 'fixed';
                sideNav.style.left = '0px';
                sideNav.style.top = head.clientHeight + 'px';
                sideNav.style.visibility = '';
            } else {
                content.style.position = 'absolute';
                content.style.left = 0 + 'px';
                sideNav.style.position = 'fixed';
                sideNav.style.left = (window.innerWidth - sideNav.clientWidth - 18) + 'px';
                sideNav.style.top = head.clientHeight + 'px';
                sideNav.style.visibility = '';
            }
        }
        moveFoot();
        content.style.visibility = '';
        if (foot) {
            /*
             * we observe any changes to the contentTarget DIV
             */

            observer.observe(contentTarget, {attributes: true});//, childList: true, characterData: true});
        }

    }
    function moveFoot() {

        //var foot = document.getElementById('footerHGS');
        if (foot) {
            foot.style.position = 'fixed';
            foot.style.left = '0px';
            foot.style.top = (window.innerHeight - foot.clientHeight) + 'px';
            foot.style.visibility = '';
        }
        var sideNav = document.getElementById('sideNavHGS');
        if (sideNav && sideNav.dataset.position !== 'left') {
            sideNav.style.left = (window.innerWidth - sideNav.clientWidth - 18) + 'px';
        }
        stretchStartDiv();
        centerContentDiv();
    }
    function stretchStartDiv() {
        var div = document.getElementById('startPageHGS');
        if (div) {
            div.style.height = window.innerHeight - 20 + 'px';
        }
    }
    function centerContentDiv() {
        var div = document.getElementById('contentDiv'),
                ln = 0, sideNav = document.getElementById('sideNavHGS');
        if (sideNav) {
            ln = sideNav.style.clientWidth;
        }
        if (div) {
            div.style.left = Math.max(ln, ln + window.innerWidth / 2 - div.clientWidth / 2) + 'px';
        }
    }
    function escape(e) {
        if (e.which === 27) { // escape
            dialogs.closeDialog();
            if (document.getElementById('flyDivflyDiv4711').style.display === 'none') {
                level0F().init();
            }
            document.getElementById('flyDivflyDiv4711').style.display = 'none';
        }
        if (e.altKey && e.key === 't') {
            document.getElementById('tSearch').style.display = '';
            document.getElementById('resultSearchTitel').style.display = '';
            document.getElementById('searchTitel').style.display = '';
        }
        return;
    }

    moveContent();
    window.addEventListener('load', moveContent, false);
    window.addEventListener('resize', moveFoot, false);
    window.addEventListener('keyup', escape, false);
}
pageItemAdjust();