
<?php

require '../marc21/marc21.php';

$json = file_get_contents('php://input');
$param = (object) json_decode($json, true);
$param->error = '';
$param->result = '';

ini_set('max_execution_time', 60 * 30);
$m21 = new m21File($param->file);
if ($m21->error !== '') {
    $param->error = $m21->error;
    echo json_encode($param, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);
    exit;
}


$m21->setPosition(0);
$offsets = [];
while ($m21->skipRecord()) {
    $offsets[] = $m21->recordOffset;
}
$param->error = $m21->error;
$param->result = $offsets;
$param->ntotal = $ntotal;

echo json_encode($param, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);
