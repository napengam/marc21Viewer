<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">    
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Marc21 Viewer</title>
        <link href = "../css/pageitems.css" type = "text/css" rel = "stylesheet" >
        <link href = "../css/misc.css" type = "text/css" rel = "stylesheet" >
        <link href = "../css/grid.css" type = "text/css" rel = "stylesheet" >
        <link rel="stylesheet" 
              href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" 
              integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay" 
              crossorigin="anonymous">

    </head>
    <body>
        <?php
        include_once "../php/pageitemsC.php";

        $p = new aPage();
        $p->startPage();
        $p->start_head_nav('');
        $p->end_head_nav();
        $p->start_hor_nav();
        $p->hor_nav_item_o(['functions' => 'marc.makeFirstPage', 'title' => 'First page', 'text' => "<i class='fas  fa-step-backward'></i>"]);
        $p->hor_nav_item_o(['functions' => 'marc.makePrevPage', 'title' => 'Previous page', 'text' => "<i class='fas fa-play fa-rotate-180'></i>"]);
        $p->hor_nav_item_o(['functions' => 'marc.makeNextPage', 'title' => 'Next page', 'text' => "<i class='fas fa-play'></i>"]);
        $p->hor_nav_item_o(['functions' => 'marc.makeLastPage', 'title' => 'Last page', 'text' => "<i class='fas  fa-step-forward'></i>"]);
        $p->hor_nav_item_o(['functions' => 'marc.settings', 'title' => 'Settings', 'text' => "<i class='fas fa-user-cog'></i>"]);
        $p->hor_nav_item_o(['functions' => 'marc.fontSizeDown', 'title' => 'Font increase', 'text' => "<span>a</span>"]);
        $p->hor_nav_item_o(['functions' => 'marc.fontSizeUp', 'title' => 'Font lessen', 'text' => "<span>A</span>"]);


        $p->end_hor_nav();
        $p->start_content();
        $p->end_content();
        $p->endPage();
        $p->pageOut();
        ?>

        <!-- js code for infrastructure -->

        <script src="../js/stickyHead.js" ></script>
        <script src="../js/myDialogs.js" ></script>      
        <script src="../js/mapFunctions.js" ></script>
        <script src="../js/myBackend.js" ></script>
        <script src="../js/veil.js" ></script>
        <script src="../js/makeDraggable.js" ></script>


        <!-- js code fro teh business logic of viewer -->

        <script src="../js_marc/marcF.js" ></script>

        <script>
            'use strict:'
            window.addEventListener('load', start, false);
            function start() {
                //
                //  setup infrastructure
                // 
                dialogs = myDialogs(); // access to dialogs      
                backend = myBackend(); // access to backend
                //
                //  get application specific functions
                //
                allOffsets = []; //of records within marc21 file
                ntotal = 0;
                time = 0;
                pager = {current: 0, last: 0};

                marc = marcF();
                // * ***********************************************
                //  start GUI; instrument  navigation
                // ************************************************
                mapFunctions('horNavHGS', '.findMe_hor', Object.assign({}, marc));
                marc.init();
                return;
            }

        </script>
    </body>
</html>
