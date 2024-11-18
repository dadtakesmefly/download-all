function aiparser() {
    var imgList = [];
    var li = {};

    function send(img) {
        var src = img.src.replace(/^(https?:)/, 'https:');
        if(src.match('^//')){
            src = location.protocol+src;
        }
        if (!li[img.src]) {
            imgList.push({...img,url:src.replace(/_\\d+.jpg/, '_1000.jpg'),title:document.title});
            li[img.src] = true;
        }
    }
    var imgSrcs = [];
    if (location.href.match('www.farfetch.cn')) {
        chrome.runtime.sendMessage({
            tip: 'SET_GROUPS',
            groups: [
                '主图',
                'SKU图片',
                '详情',
            ]
        });
        var indexNum = 1;
        function __PrefixZero(num, n) {
            return (Array(n).join('0') + num).slice(-n);
        }
        document.querySelectorAll('[data-tstid="slideshow"] img').forEach(function (img) {
			imgSrcs.push({
				src: img.src,
				group: '主图',
                indexName: '主图_' + __PrefixZero(indexNum++,3),
                groupIndex: 0,
			});
        });
        document.querySelectorAll('[data-test="imagery"] img').forEach(function (img) {
			imgSrcs.push({
				src: img.src,
				group: '主图',
                indexName: '主图_' + __PrefixZero(indexNum++,3),
                groupIndex: 0,
			});
        });
        indexNum = 1;
		document.querySelectorAll('[data-tstid="sameStyleSlider"] img').forEach(function(img){
			imgSrcs.push({
				src: img.src,
				group: 'SKU图片',
                indexName: 'SKU图片_' + __PrefixZero(indexNum++,3),
                groupIndex: 1,
			})
        });
        indexNum = 1;
        document.querySelectorAll('[data-tstid="detailsImage"] img, [data-tstid="productDetails"] img').forEach(function (img) {
			imgSrcs.push({
				src: img.src,
				group: '详情',
                indexName: '详情_' + __PrefixZero(indexNum++,3),
                groupIndex: 2,
			});
        });
        if(imgSrcs.length === 0){
            document.querySelectorAll('img').forEach(function (img) {
                imgSrcs.push({
                    src: img.src
                });
            });
        }
    }
    for (var i = 0; i < imgSrcs.length; i++) {
        if (imgSrcs[i].src.match('blank.gif')) continue;
        send(imgSrcs[i]);
    }
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();

