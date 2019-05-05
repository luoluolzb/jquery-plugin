<?php
$uploadDir = 'uploads/';

function responseJSON($errcode, $data = array())
{
	$res = array(
		'errcode' => $errcode,
		'data' => $data
	);
	header('Content-Type: application/json');
	echo json_encode($res);
}

if (isset($_REQUEST['fileId'])) {
	$fileName = $uploadDir.$_REQUEST['fileId'];

	if (!file_exists($fileName)) {
		responseJSON(1, ['msg' => 'file not exists!']);
	}

	if (unlink($fileName)) {
		responseJSON(0);
	} else {
		responseJSON(2, ['msg' => 'delete failed!']);
	}
}
