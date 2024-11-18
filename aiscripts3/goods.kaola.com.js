function aiparser() {
	var imgList = [];
	var li = {};

	function send(img) {
		if (!li[img.src]) {
			imgList.push({...img,url:img.src.match('^http')? img.src : (location.protocol+img.src),title:document.title});
			li[img.src] = true;
		}
	}
    var imgSrcs = [];
    if (location.href.match('goods.kaola.com(.hk)?/product')) {
		chrome.runtime.sendMessage({
			tip: 'SET_GROUPS',
			groups: [
				'主图',
				'SKU图片',
				'详情',
			]
		});
		function __PrefixZero(num, n) {
			return (Array(n).join('0') + num).slice(-n);
		}
		var bigImgSrc = '';
		var indexNum = 1;
        document.querySelectorAll('.litimg_box img').forEach(function (img) {
            bigImgSrc = img.src.replace(/\/n\d+\//, '/imgzone/').replace(/s\d+x\d+_jfs/, 'jfs').replace(/!cc_50x64.jpg$/, '').replace(/\.jpg\?.*/, '.jpg');
			imgSrcs.push({
				src: bigImgSrc,
				group: '主图',
				indexName: '主图_' + __PrefixZero(indexNum++,3),
				groupIndex: 0,
			});
		});
		indexNum = 1;
		document.querySelectorAll('#js_skuBox img').forEach(function(img){
			imgSrcs.push({
				src: img.src,
				group: 'SKU图片',
				indexName: 'SKU图片_' + __PrefixZero(indexNum++,3),
				groupIndex: 1,
			})
		});
		indexNum = 1;
        document.querySelectorAll('#textareabox img').forEach(function (img) {
			imgSrcs.push({
				src: img.dataset.src || img.src,
				group: '详情',
				indexName: '详情_' + __PrefixZero(indexNum++,3),
				groupIndex: 2,
			});
        });
    } else {
    }
    for (var i = 0; i < imgSrcs.length; i++) {
        send(imgSrcs[i]);
    }
	chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();
