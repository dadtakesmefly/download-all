function aiparser() {
    function send(img) {
        var src = img.src.replace(/^(https?:)/, 'https:');
        if(src.match('^//')){
            src = location.protocol+src;
        }
        img.url = src.replace('!cc_60x76.jpg', '');
        img.title = document.title
    }
    function getFileName(url) {
        let str = url.split("?");
        str = str[0].split("/");
        str = str[str.length - 1].split("#");
        return str[0].toLowerCase();
    }
    var imgSrcs = [];
    if (location.href.match('item.jd.(com|hk)')) {
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
        var bigImgSrc = '';
        document.querySelectorAll('#spec-list img').forEach(function (img) {
            bigImgSrc = img.src.replace(/\/n\d+\//, '/imgzone/').replace(/s\d+x\d+_jfs/, 'jfs').replace(/!cc_50x64.jpg$/, '');
			imgSrcs.push({
				src: img.src.replace(/^(https?:)/, 'https:'),
				group: '主图',
                indexName: '主图_' + __PrefixZero(indexNum++,3),
                groupIndex: 0,
			});
        });
        indexNum = 1;
		document.querySelectorAll('#choose-attrs img').forEach(function(img){
			imgSrcs.push({
				src: img.src,
				group: 'SKU图片',
                indexName: 'SKU图片_' + __PrefixZero(indexNum++,3),
                groupIndex: 1,
			})
        });
        indexNum = 1;
        document.querySelectorAll('#J-detail-content img').forEach(function (img) {
			imgSrcs.push({
				src: img.src,
				group: '详情',
                indexName: '详情_' + __PrefixZero(indexNum++,3),
                groupIndex: 2,
			});
        });
        var style = document.querySelector('#J-detail-content style');
        if (style) {
            var patt1 = new RegExp(".ssd-module-wrap (\\..+?){.*?background-image:url\\((.+?)\\)", "g");
            var result = patt1.exec(style.innerText);
            while (result) {
				imgSrcs.push({
					src: result[2].replace(/^(https?:)/, 'https:'),
					group: '详情',
                    indexName: '详情_' + __PrefixZero(indexNum++,3),
                    groupIndex: 2,
				});
                result = patt1.exec(style.innerText);
            }
        }
        var vid = document.getElementById('v-video');
        if (vid) {
            if (chrome.runtime.sendMessage) {
                chrome.runtime.sendMessage({
                    tip: 'NET',
                    settings: {
                        url: 'https://c.3.cn/tencent/video_v3',
                        data: {
                            vid: vid.dataset.vu,
                            _: Date.now()
                        },
                        dataType: 'json'
                    }
                });
            }
        }
    } else {
        document.querySelectorAll('img').forEach(function (img) {
			imgSrcs.push({
				src: img.src
			});
        });
    }
    const li = [];
    const lis = {};
    for (var i = 0; i < imgSrcs.length; i++) {
        if (imgSrcs[i].src.match('blank\.(gif|png)')) continue;
        send(imgSrcs[i]);
        if (!lis[imgSrcs[i].src]) {
            li.push(imgSrcs[i]);
            lis[imgSrcs[i].src] = true;
        }
    }
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:li});
}
aiparser();
