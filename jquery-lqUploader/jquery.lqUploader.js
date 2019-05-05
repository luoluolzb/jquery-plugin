/**
 * jQuery文件上传插件
 * @author  luoluolzb
 * @github  https://github.com/luoluolzb/lqUploader
 * @version 1.0
 */
;(function($){
	/**
	 * 默认配置
	 */
	var e = new Array();
	var defultConfigs = {
		//文件上次方法，默认为post
		'method': 'post',

		//文件上传处理脚本
		'uploadScript': 'serverScript/upload.php',

		//文件删除处理脚本
		'deleteScript': 'serverScript/delete_file.php',

		//上传到服务的文件标签名
		'uploadName': 'fileData',

		//文件限制大小, 默认0不限制
		'maxFileSize': 0,

		//文件后缀允许列表, 默认为空不限制
		'typeList': [],

		//上传附加参数：默认为空
		'paramList': {},

		//删除文件附加参数：默认为空
		'deleteParamList': {},
		
		//消息显示函数
		'showMessage': function(info) {
			alert(info);
		},

		//事件：选择文件后
		'onSelectFile': function(file) {
			//some code
		},

		/**
		 * 事件：文件超过限制大小时
		 * @param  integer size 文件大小
		 */
		'onMaxFileSize': function(size) {
			defultConfigs.showMessage('文件过大！');
		},

		/**
		 * 事件：文件类型错误时
		 * @param  string fileType 文件类型（后缀）
		 */
		'onTypeError': function(fileType) {
			defultConfigs.showMessage('文件类型错误！');
		},

		/**
		 * 事件：文件上传成功
		 */
		'onUploadSuccess': function() {
			//some code
		},

		/**
		 * 事件：文件删除成功
		 */
		'onDeleteSuccess': function() {
			//some code
		},

		/**
		 * 事件：文件上传失败
		 */
		'onUploadError': function(msg = '') {
			var text = '上传出错！';
			if (msg.length > 0) {
				text += '错误描述：' + msg;
			}
			defultConfigs.showMessage(text);
		},

		/**
		 * 事件：文件删除失败
		 */
		'onDeleteError': function(msg = '') {
			var text = '删除失败！';
			if (msg.length > 0) {
				text += '错误描述：' + msg;
			}
			defultConfigs.showMessage(text);
		},

		/**
		 * 处理文件上传处理脚本返回数据
		 * 此函数处理的返回信息格式：
		 *   上传成功时：{errcode: 0, data: ['msg' => string, 'file_id' => mixed]}
		 *   上传失败时：{errcode: !0, data: ['msg' => string]}
		 * 其他格式需要自定义此函数
		 * 
		 * @param  mixed response 脚本返回数据
		 * @return {'result': boolean, 'fileId' => string, 'msg' => string}
		 */
		'handleUploadData': function(response) {
			//console.log(response);
			if (response.errcode == 0) {
				return {
					'result': true,
					'fileId': response.data['file_id'],
					'msg': response.data['msg'],
				};
			} else {
				return {
					'result': false,
					'fileId': '',
					'msg': response.data['msg'],
				};
			}
		},

		/**
		 * 处理文件删除处理脚本返回数据
		 * 此函数处理的返回信息格式：
		 *   上传成功时：{errcode: 0, data: ['msg' => string]}
		 *   上传失败时：{errcode: !0, data: ['msg' => string]}
		 * 其他格式需要自定义此函数
		 * 
		 * @param  mixed response 脚本返回数据
		 * @return {'result': boolean, 'msg' => string}
		 */
		'handleDeleteData': function(response) {
			//console.log(response);
			if (response.errcode == 0) {
				return {
					'result': true,
					'msg': response.data['msg'],
				};
			} else {
				return {
					'result': false,
					'msg': response.data['msg'],
				};
			}
		},
	};


	/**
	 * 工具函数
	 */
	var ToolFunc = {
		/**
		 * 获取文件大小的字符串形式
		 */
		'getSizeString': function(fileSize) {
			/**
			 * 函数功能：如果是小数，保留一位小数，否则返回原值
			 */
			var getLen = function(size) {
				if (size % 1 != 0) {
					return size.toFixed(1);
				} else {
					return size;
				}		
			};

			if (fileSize < 1024) {
				return fileSize + 'B';
			} else if(fileSize < 1048576) {
				return getLen(fileSize/1024) + 'KB';
			} else{
				return getLen(fileSize/1048576) + 'MB';
			}
		},

		/**
		 * 添加一个文件项
		 */
		'addFile': function($fileList, fileName, fileSize, fileId) {
			var $file = $('\
				<div class="lqUploader-file" data-file-id="'+ fileId +'">\
					<span class="lqUploader-filename">\
						<i class="fa fa-'+ ToolFunc.getTypeClass(fileName) +'"></i> ' +
						fileName + '\
					</span>\
					<span class="lqUploader-filesize">(' + ToolFunc.getSizeString(fileSize) + ')</span>\
					<span class="lqUploader-delete">删除</span>\
				</div>\
			');
			$fileList.append($file);
		},

		/**
		 * 删除一个文件项
		 */
		'deleteFile': function($fileList, fileId) {
			$fileList.find('.lqUploader-file[data-file-id="'+ fileId +'"]').remove();
		},

		/**
		 * 获取文件类型(后缀名)
		 */
		'getFileType': function(fileName) {
			var index1 = fileName.lastIndexOf(".");
			var index2 = fileName.length;
			var suffix = fileName.substring(index1 + 1, index2);
			return suffix.toLowerCase();
		},

		/**
		 * 获取文件类型对应的fontawesome样式类
		 */
		'getTypeClass': function(fileName) {
			switch(ToolFunc.getFileType(fileName)) {
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
		},
	};


	/**
	 * 插件入口函数
	 */
	var lqUploader = function(configs = {}){
		/* 覆盖(扩充)默认配置 */
		configs = $.extend(defultConfigs, configs);

		/**
		 * uploader元素(jQuery元素)
		 */
		var $uploader = this;

		/**
		 * 文件上传按钮(jQuery元素)
		 */
		var $button = $uploader.find('.lqUploader-button');

		/**
		 * 隐藏状态的文件框(jQuery元素)
		 */
		var $input = $uploader.find('.lqUploader-input');

		/**
		 * 文件显示列表(jQuery元素)
		 */
		var $fileList = $uploader.find('.lqUploader-filelist');

		/**
		 * 上传一个文件
		 */
		var uploadFile = function(file) {
			var formData = new FormData();
			formData.append(configs.uploadName, file);
			for(var key in configs.paramList) {
				formData.append(key, configs.paramList[key]);
			}
			$.ajax({
				'url': configs.uploadScript,
				'method': configs.method,
				'data': formData,
				'processData': false,
				'contentType': false,
            	'success': function(data, status){
            		var ret = configs.handleUploadData(data);
            		//console.log(ret);
            		if (ret.result) {
            			ToolFunc.addFile($fileList, file.name, file.size, ret.fileId);
            			configs.onUploadSuccess();
            		} else {
            			configs.onUploadError(ret.msg);
            		}
            	},
            	'error': function(xmlHttpReq, status, errorThrown) {
            		configs.onUploadError(status);
            	}
			});
		};

		/**
		 * 删除一个已经上传的文件
		 */
		var deleteFile = function(fileId) {
			var data = $.extend({'fileId': fileId}, configs.deleteParamList);
			$.ajax({
				'url': configs.deleteScript,
				'method': configs.method,
				'data': data,
            	'success': function(data, status){
            		var ret = configs.handleDeleteData(data);
            		console.log(status);
            		console.log(ret);
            		if (ret.result) {
            			ToolFunc.deleteFile($fileList, fileId);
            			configs.onDeleteSuccess();
            		} else {
            			configs.onDeleteError(ret.msg);
            		}
            	},
            	'error': function(xmlHttpReq, status, errorThrown) {
            		console.log(status);
            		console.log(data);
            		configs.onDeleteError(status);
            	}
			});
		};

		/**
		 * 监听文件添加按钮
		 */
		$button.click(function(){
			$input.trigger('click');   //触发文件选择框
		});

		/**
		 * 监听文件选择框
		 */
		$input.change(function(){
			var files = $input.get(0).files;
			if (files.length == 0) {
				return false;
			}
			var file = files[0];
			configs.onSelectFile(file);

			//检查文件大小
			if (configs.maxFileSize > 0 && file.size > configs.maxFileSize) {
				configs.onMaxFileSize(file.size);
				return false;
			}

			//检查文件类型
			var fileType = ToolFunc.getFileType(file.name);
			if (configs.typeList.length > 0 && configs.typeList.indexOf(fileType) < 0) {
				configs.onTypeError(fileType);
				return false;
			}

			uploadFile(file);
			$input.val('');
			return true;
		});

		/**
		 * 监听删除选项
		 */
		$fileList.on('click', '.lqUploader-delete', function(){
			var fileId = $(this).parent().data('fileId');
			deleteFile(fileId);
		});

	};

	$.fn.extend({
		'lqUploader': lqUploader,
	});
})(jQuery);
