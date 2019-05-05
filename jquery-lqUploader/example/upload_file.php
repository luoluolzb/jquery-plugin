<?php
require 'lqUploader_FileInfo.php';

/* 上传文件保存路径 */
$uploadDir = 'serverScript/uploads/';

/* 搜索文件列表 */
$fileList = [];
$dirHandle = opendir($uploadDir);
while (false !== ($fileName = readdir($dirHandle))) {
	if ($fileName == "." || $fileName == "..") {
		continue;
    }
	$fileList[] = [
		'fileId' => $fileName,
		'name' => $fileName,
		'size' => filesize($uploadDir . $fileName),
	];
}

/* 获取信息列表 */
$lqUploader_FileInfo = new lqUploader_FileInfo();
$infoList = $lqUploader_FileInfo->getList('', $fileList);
$html = $lqUploader_FileInfo->getHtml($infoList);
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>lqUploader Demo</title>
	<link rel="stylesheet" type="text/css" href="../jquery.lqUploader.min.css">
	<link rel="stylesheet" href="../font-awesome/css/font-awesome.min.css">
</head>
<body>
	<main>
		<div id="lqUploader" class="lqUploader">
			<button class="lqUploader-button">添加附件</button>
			<input class="lqUploader-input" type="file"/>
			<div class="lqUploader-filelist">
			<?php echo $html; ?>
		</div>
	</main>
	<script src="../jquery-1.12.4.min.js"></script>
	<script src="../jquery.lqUploader.min.js"></script>
	<script type="text/javascript">
	$(function(){
		$('#lqUploader').lqUploader();
	});
	</script>
</body>
</html>