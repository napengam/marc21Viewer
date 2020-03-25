
<?php

require '../marc21/marc21.php';
include 'ddc.php';

$json = file_get_contents('php://input');
$param = (object) json_decode($json, true);
$param->error = '';
$param->result = '';

$filter = '';
if (strlen($param->filter) > 0) {
    $filter = $param->filter;
}
$limit = 100;
if ($param->rpv) {
    $limit = $param->rpv;
}
if ($param->file) {
    $file = $param->file;
} else {
    $param->error = "please set a MARC21 file line file='path to file'";
    echo json_encode($param, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);
    exit;
}
$m21 = new m21File($file);
if ($m21->error) {
    $param->error = $m21->error;
    $param->result = '';
    echo json_encode($param, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);
    exit;
}
$m21->setTagFilter($filter);
$nrec = $nmatch = 0;

$echo = [];


$fi = '';
if ($filter) {
    $fi = "<br> filtered by tags $filter ";
}

$h2 = '<h2 id=h2id style="">File=' . basename($file) . " with $param->ntotal records in $param->time seconds; $fi <br>" . $git;
$echo[] = '<table style="margin-left:10px;width:auto" id=t1 class=tgrid>'
        . "<tr><th class=tgrid_th colspan=4>Parameters</th><th class=tgrid_th colspan=1>$h2</th></tr>"
        . '<tr><th class=tgrid_th>Tag</th><th class=tgrid_th>Seq</th><th data-rotate class=tgrid_th>Indicator</th>'
        . '<th data-rotate=">" class=tgrid_th>Subfield<br>Code</th><th class=tgrid_th> Subfielddata</th></tr>';
$nrec = $param->current;
$ndisplay = 0;
foreach ($param->get as $offset) {
    $m21->setPosition($offset);
    $tags = $m21->decodeRecord();
    if ($m21->error !== '') {
        $param->result = '';
        $param->error = $m21->error;
        echo json_encode($param, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);
        exit;
    }
    if ($limit > 0 && $ndisplay > $limit) {
        break;
    }
    if (count($tags) == 0) {
        continue; 
    }
    $echo[] = '<tr style="background:whitesmoke;"><td></td><td></td><td></td><td></td><td style="text-align:right;">' . ($nrec) . '</td></tr>';
    $ddcEntry = count($echo) - 1;
    $ddt = [];
    foreach ($tags as $oneTag) {
        $echo [] = "<tr  $bgrow><td>" . $oneTag->tag . '</td><td style="text-align:right">' . $oneTag->seq . '</td><td> ' . $oneTag->ind . '</td>';
        $head = '';
        foreach ($oneTag->subs as $sub) {

            $href = '';
            if ($oneTag->tag === '020' && $sub->code === '9' && $oneTag->seq == 1) {
                $href = hrefAmazon($sub->data);
            }
            if ($sub->code != '' || $oneTag->tag === '001') {
                $sub->data = checkForUri($sub->data, $oneTag->tag);
            } else {
                $sub->data = htmlentities($sub->data, ENT_COMPAT);
            }

            $ddcText = '';
            if ($param->ddcflag && $oneTag->tag == '082' && $sub->code == 'a') {
                $ddcText = $DDC[(int) $sub->data];
                $ddt[] = $ddcText;
            }
            $isbn = '';
            if ($href) {
                $isbn = "<a href='$href' target=amaz><i class='fab fa-amazon'></i></a>";
            }


            $echo[] = "$head<td align=center>" . $sub->code . '</td><td> ' . wordwrap($sub->data, 120) . '<span style=float:right;color:gray>' . wordwrap($ddcText, 80) . $isbn . '</span></td></tr>';
            $head = '<tr><td></td><td></td><td></td>';
        }
    }
//    if ($param->ddcflag) { 
//        $echo[$ddcEntry] = '<tr style="background:whitesmoke;"><td colspan=5 style="text-align:right;"><div style=color:gray>' . wordwrap(implode('<br>', $ddt), 80) . ' </div> ' . ($nrec) . '</td></tr>';
//    }
    $ndisplay++;
    $nrec++;
}

$echo[] = '</table>';
$param->result = implode('', $echo);
echo json_encode($param, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);
exit;
/*
 * **************************
 * make links if possible
 * **************************
 */

function checkForUri($data, $tag) {

    $target = ' target=link ';
    if (mb_substr($data, 0, 5) == '(uri)') {
        $data = '<a  ' . $target . 'href="' . mb_substr($data, 5) . '">' . $data . '</a>';
    } else if (mb_substr($data, 0, 5) == 'http:') {
        $data = '<a  ' . $target . 'href="' . $data . '">' . $data . '</a>';
    } else if (mb_substr($data, 0, 6) == 'https:') {
        $data = '<a  ' . $target . 'href="' . $data . '">' . $data . '</a>';
    } else if ($tag === '001') {
        $data = '<a  ' . $target . 'title="Link to DNB" href="http://d-nb.info/' . $data . '">' . $data . '</a>';
    }

    return $data;
}

function hrefAmazon($isbn) {
    $href = '';
    $isbn = implode('', explode('-', $isbn));
    $href = "http://www.amazon.de/s/ref=nb_sb_noss?url=search-alias%3Dstripbooks&field-keywords=$isbn";
    return $href;
}
