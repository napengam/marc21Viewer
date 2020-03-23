<?php

class aPage {

    private $fixedHead = false, $sideNav = false, $thePage = [],
            $stdOpt = [
                'id' => '',
                'nurl' => '',
                'url' => '',
                'title' => '',
                'text' => '',
                'events' => 'click',
                'functions' => '',
                'submenu' => ''
                    ],
            $caretRight = "<i class='fa fa-caret-right'></i>";

    function pageOut() {
        echo implode("\n", $this->thePage);
        $this->thePage = [];
    }

    function startPage() {
        $this->thePage[] = "<!-- Start of Page -->";
        $this->thePage[] = '<div id=startPageHGS>';

        return;
    }

    function endPage() {
        $t = "</div><script src='../js/pageitems.js'></script>";
        $this->thePage[] = $t;
        $this->thePage[] = "<!-- End of Page -->";
        return $t;
    }

    function start_head_nav($title) {
        $d = date('d.m.Y H:i');
        $this->fixedHead = true;
        $this->thePage[] = "<!-- Start of Head Navigation -->";
        $this->thePage[] = "<div id=headdivHGS class=headdivHGS>";
        //$this->thePage[] = "<div class=headTitle >$title / $d</div>";
        $this->thePage[] = '<div class=stripes>';
        $this->thePage[] = headOne();
        return;
    }

    function head_nav_item($url, $text) {
        if ($url) {
            $this->thePage[] = "<li class = 'menuSpan findMe_head'><a href = \"$url\" class=headLink >$text</a>";
        } else {
            $this->thePage[] = "<li class='menuSpan findMe_head'>$text</li>";
        }
        return;
    }

    function end_head_nav($ticker = '') {
        if ($ticker) {
            $this->thePage[] = "<div id=ticker>$ticker</div>";
        }
        $this->thePage[] = '</div>';
        $this->thePage[] = '</div>';
        $this->thePage[] = "<!-- End of Head Navigation -->";
        return;
    }

    function start_hor_nav() {
        $this->thePage[] = "<!-- Start of Horizontal Navigation -->";
        $this->thePage[] = '<div id=horNavHGS style="text-align:center;display: inline-block;margin-left: 10px;">';
        return;
    }

    function hor_nav_item($url, $text, $eventAction = '') {
        $ti = $this->textTitel($text);
        $ea = $this->eventAction($eventAction);
        if ($url != '') {
            $this->thePage[] = "<span class='menuSpan findMe_hor' $ti $ea ><a  href=\"$url\"  ><b>$text</b></a></span>";
        } else {
            $this->thePage[] = "<span class='menuSpan findMe_hor' $ti $ea ><b>$text</b></span>";
        }
        return;
    }

    function hor_nav_item_o($options) {
        $opt = $this->optAssign((object) $options);
        $ea = '';
        if ($opt->events && $opt->functions) {
            $ea = " data-event='$opt->events' data-funame='$opt->functions'";
        }
        $ti = $this->textTitel($opt->text);
        if ($ti) {
            $title = $ti;
        } else {
            $title = " title='$opt->title'";
        }
        if ($opt->url || $opt->nurl) {
            $target = '';
            if ($opt->nurl) {
                $opt->url = $opt->nurl;
                $target = " target='$opt->text' ";
            }
            $this->thePage[] = "<span id='$opt->id' class='menuSpan findMe_hor' $title $ea ><a  href=\"$opt->url\" $target ><b>$opt->text</b></a></span>";
        } else {
            $this->thePage[] = "<span id='$opt->id' class='menuSpan findMe_hor' $title $ea  ><b>$opt->text</b></span>";
        }
        return;
    }

    function end_hor_nav() {
        $this->thePage[] = '</div>';
        $this->thePage[] = $this->end_fixed_head();
        $this->thePage[] = "<!-- End of Horizontal Navigation -->";
        return;
    }

    function end_fixed_head() {

        if ($this->fixedHead) {
            $this->thePage[] = "</div><br>";
            $this->fixedHead = false;
        }
        return;
    }

    function start_side_nav($position = 'left') {
        $this->sideNav = true;
        $this->thePage[] = "<!-- Start of Side Navigation -->";
        $this->thePage[] = "<div id=sideNavHGS class=sideNavHGS data-position='$position'>";
        return;
    }

    function side_nav_item($url, $text, $eventAction = '') {
        $ti = $this->textTitel($text);
        $class = " class=' findMe_side' ";
        $ea = $this->eventAction($eventAction);
        if ($url != '') {
            $this->thePage[] = "<a $ea $class  $ti href=\"$url\"><div><b>$this->caretRight $text</b></div></a>";
        } else {
            $this->thePage[] = " <div $ea  $class $ti><b>$this->caretRight $text</b></div>";
        }
        return;
    }

    function side_nav_item_o($options) {
        $options = $this->optAssign((object) $options);
        $opt = $options;
        foreach ($options as $key => $value) {
            ${$key} = $value;
        }
        $ea = '';
        if ($opt->events && $opt->functions) {
            $ea = " data-event='$opt->events' data-funame='$opt->functions'";
        }
        $sm = '';
        if ($opt->submenu) {
            $sm = " data-event='$opt->submenu' ";
        }
        if ($opt->url || $opt->nurl) {
            $target = '';
            if ($opt->nurl) {
                $opt->url = $opt->nurl;
                $target = " target='$opt->text' ";
            }
            $this->thePage[] = "<span id='$opt->id' class='menuSpan findMe_side' title='$opt->title' $ea $sm><a  href=\"$opt->url\" $target ><b>$this->caretRight $opt->text</b></a></span>";
        } else {
            $this->thePage[] = "<span id='$opt->id' class='menuSpan findMe_side' title='$opt->title' $ea $sm><b>$this->caretRight $opt->text</b></span>";
        }
        return;
    }

    function end_side_nav() {
        $this->sideNav = false;
        $this->thePage[] = '</div>';
        $this->thePage[] = "<!-- End of Side Navigation -->";
        return;
    }

    function start_sub_side_nav($id) {
        if ($this->sideNav === false) {
            return;
        }
        $this->subSideNav = true;
        $this->thePage[] = "<!-- Start of Sub Side $id Navigation -->";
        $this->thePage[] = "<div id=$id style='display:none' class=sideNavHGS data-position='$position'>";
        return;
    }

    function end_sub_side_nav($id) {
        if ($this->sideNav === false) {
            return;
        }
        $this->subSideNav = false;
        $this->thePage[] = "<!-- End of Sub Side Navigation -->";
        $this->thePage[] = "</div >";
        return;
    }

    function start_content() {

        $this->thePage[] = "<!-- Start of Content -->";
        $this->thePage[] = "<div id=contentDiv class='contentcell nonavcell' style='visibility:hidden;' ><div id=contentTarget>";
        return;
    }

    function end_content() {

        $this->thePage[] = '</div></div>';
        $this->thePage[] = "<!-- End of Content -->";
        return;
    }

    function footer($c = '') {
        if ($c == '') {
            $c = "&copy;2007 - " . date('Y') . " Heinrich Schweitzer All rights reserved.";
        }
        $this->thePage[] = "<!-- Footer -->";
        $this->thePage[] = "<div id=footerHGS class=stripes style='z-Index:20'>"
                . "<div style='text-align:center'>$c</div>"
                . "<div class=headTitle >&nbsp;</div>"
                . "</div>";
        return;
    }

    function addContainer($id) {
        $this->thePage[] = "<div id='$id'></div>";
    }

    function addHTML($html) {
        $this->thePage[] = $html;
    }

    function includeFile($fileName) {
        $this->thePage[] = @file_get_contents($fileName);
    }

    private function textTitel(&$text) {
        $arr = explode('|', $text);
        $ti = '';
        if (count($arr) > 1) {
            $ti = " title='" . $arr[1] . "' ";
            $text = $arr[0];
        }
        return $ti;
    }

    private function eventAction($ea) {
        if ($ea) {
            list($event, $action) = explode('|', $ea);
            $e = " data-event='$event' ";
            $a = " data-funame='$action' ";
        }
        return $e . $a;
    }

    private function optAssign($opt) {

        foreach ((object) $this->stdOpt as $key => $defaultValue) {
            if ($opt->{$key}) {
                continue;
            }
            $opt->{$key} = $defaultValue;
        }
        return $opt;
    }

}

function headOne() {


    return '
    <div style="text-align:center;background-color:white;">
    <!--h2>MARC21 Viewer</h2 --> ';
}
