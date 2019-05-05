<?php
/**
 * 文件信息列表获取类
 */
class lqUploader_FileInfo
{
	/**
	 * 获取文件信息列表(用于生成上传文件列表)
	 * 
	 * @param  string $baseDir  基准文件夹
	 * @param  array  $fileList = [
	 *    [
	 *    	'fileId' => mixed,  //文件id
	 *    	'name' => string,   //文件名（不含目录部分）
	 *    	'size' => integer,  //文件大小
	 *    ],
	 *    ...
	 * ]
	 * @return array = [
	 *     [
	 *         'fileId' => string,
	 *         'name' => string,
	 *         'sizeString' => string,
	 *         'type' => string,
	 *         'typeClass' => string,
	 *     ],
	 *     ...
	 * ]
	 */
	public function getList($baseDir, $fileList)
	{
		$infoList = [];
		foreach ($fileList as $file) {
			$type = $this->getFileType($file['name']);
			$infoList[] = [
				'fileId' => $file['fileId'],
				'name' => $file['name'],
				'sizeString' => $this->getSizeString($file['size']),
				'type' => $type,
				'typeClass' =>$this->getTypeClass($type),
			];
		}
		return $infoList;
	}

	/**
	 * 获取文件列表html
	 * 
	 * @param  array  $infoList  getList返回的内容
	 * @return string html文本           
	 */
	public function getHtml($infoList)
	{
		$html = '';
		foreach ($infoList as $info) {
			$html .= <<< EOT
			<div class="lqUploader-file" data-file-id="{$info['fileId']}">
			<span class="lqUploader-filename"><i class="fa fa-{$info['typeClass']}"></i> {$info['name']}</span>
			<span class="lqUploader-filesize">({$info['sizeString']})</span>
			<span class="lqUploader-delete">删除</span>
			</div>
EOT;
		}
		return $html;
	}

	/**
	 * 获取文件大小的字符串形式描述
	 * 
	 * @param  integer $fileSize 文件大小
	 * @return string
	 */
	private function getSizeString($fileSize)
	{
		if ($fileSize < 1024) {
			return sprintf('%dB', $fileSize);
		} else if($fileSize < 1048576) {
			if ($fileSize % 1024 == 0) {
				return sprintf('%dKB', $fileSize/1024);
			} else {
				return sprintf('%sKB', number_format($fileSize/1024, 1));
			}
		} else{
			if ($fileSize % 1048576 == 0) {
				return sprintf('%dMB', $fileSize/1048576);
			} else {
				return sprintf('%sMB', number_format($fileSize/1048576, 1));
			}
		}
	}

	/**
	 * 获取文件类型（后缀）（自动转换为小写）
	 * 
	 * @param  string $fileName 文件名
	 * @return string
	 */
	private function getFileType($fileName)
	{
		$exp = explode('.', $fileName);
		$ext = end($exp);
		return strtolower($ext);
	}

	/**
	 * 获取文件类型对应的fontawesome样式类
	 * 
	 * @param  string $fileType 文件类型
	 * @return string
	 */
	private function getTypeClass($fileType)
	{
		switch($fileType) {
			case 'xls':
			case 'xlsx':
				return 'file-excel-o';
				break;

			case 'pdf':
				return 'file-pdf-o';
				break;

			case 'mp3':
			case 'rm':
			case 'ogg':
			case 'mid':
			case 'wav':
				return 'file-sound-o';
				break;

			case 'doc':
			case 'docx':
				return 'file-word-o';
				break;

			case 'zip':
			case 'rar':
			case '7z':
				return 'file-archive-o';
				break;

			case 'jpg':
			case 'png':
			case 'gif':
				return 'file-image-o';
				break;

			case 'txt':
			case 'html':
			case 'htm':
				return 'file-text-o';
				break;

			case 'avi':
			case 'wma':
			case 'rmvb':
			case 'mp4':
			case '3gp':
			case 'flash':
				return 'file-movie-o';
				break;

			case 'ppt':
			case 'pptx':
				return 'file-powerpoint-o';
				break;

			case 'c':
			case 'cpp':
			case 'js':
			case 'php':
			case 'py':
				return 'file-powerpoint-o';
				break;

			default:
				return 'file-o';
				break;
		}
	}
}
