<?php

$json = file_get_contents('php://input');
$param = (object) json_decode($json, true);
$param->error = '';
$param->result = '';
$echo = [];
$echo[] = "<div id=mvsettings style='text-align:left' class='findMe' data-event=keyup data-funame='marc.keyup'> ";
$echo[] = "<label for=m21><b>File</b>:</label><br><input tabindex=1 id=m21 name=file type=text value='$param->file' size=40 maxlength=256><br>";
$echo[] = "<label for=fil><b>Filter</b>; list of tags to display</label><br><input  tabindex=2 id=fil name=filter type=text value='$param->filter' size=40 maxlength=256><br>";
//$echo[] = "Offset:<br><input data-type=n name=offset type=text value='$param->offset' size=11 maxlength=256><br>";
$echo[] = "<label for=rnum><b>Record number</b>; starts with 0</label><br><input  tabindex=3 id=rnum data-type=n  name=recnum type=text value='$param->recnum' size=5 maxlength=256><br>";
$echo[] = "<label for=rpp><b>Records per page</b>:</label><br><input  tabindex=4  id=rpp data-type=n  name=rpv type=text value='$param->rpv' size=2 maxlength=2><br>";
$echo[] = "<hr><button  tabindex=5 class='findMe' data-event='click' data-funame='marc.saveSettings' >Save</button>";
$echo[] = "</div>";
$param->result = implode('', $echo);
echo json_encode($param, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);
