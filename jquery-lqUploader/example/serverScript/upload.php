<?php
$uploadDir = 'uploads/';

function errorHandler($errno, $errstr, $errfile, $errline) {
	$msg = $errstr . ' in file:' . $errfile . ' on line:' . $errline;
	responseJSON($errno, ['msg' => $msg]);
    return true;
}
$old_error_handler = set_error_handler("errorHandler");

function responseJSON($errcode, $data = array())
{
	$res = array(
		'errcode' => $errcode,
		'data' => $data
	);
	header('Content-Type: application/json');
	echo json_encode($res);
	exit();
}

if (empty($_FILES) || !isset($_FILES['fileData'])) {
	responseJSON(1, ['msg' => 'not file upload!']);
}

$fileData   = $_FILES['fileData'];
$tempFile   = $fileData['tmp_name'];
$targetFile = $uploadDir . $fileData['name'];

if (file_exists($targetFile)) {
	responseJSON(2, ['msg' => 'file exists!']);
}

if (move_uploaded_file($tempFile, $targetFile)) {
	responseJSON(0, ['file_id' => $fileData['name']]);
} else {
	responseJSON(3, ['msg' => 'file save failed!']);
}
