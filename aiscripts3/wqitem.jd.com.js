function aiparser(tabInfo) {
    var imgList = [];
    var li = {};

    function send(img) {
        var src = img.src.replace(/^(https?:)/, 'https:');
        if (src.match('^//')) {
            src = location.protocol + src;
        }
        img.src = src;
        if (!li[img.src]) {
            imgList.push({...img,url:img.src,title:document.title});
            li[img.src] = true;
        }
    }
    function getBigImg(src){
        return src.replace(/\/n\d+\//, '/imgzone/').replace(/s\d+x\d+_jfs/, 'jfs').replace(/!cc_50x64.jpg$/, '').replace(/\.jpg.*/, '.jpg');
    }
    var imgSrcs = [];
    if (1) {
        chrome.runtime.sendMessage({
            tip: 'SET_GROUPS',
            groups: [
                '主图',
                '详情',
            ]
        });
        var indexNum = 1;
        function __PrefixZero(num, n) {
            return (Array(n).join('0') + num).slice(-n);
        }
        var bigImgSrc = '';
        document.querySelectorAll('#loopImgUl img').forEach(function (img) {
            bigImgSrc = getBigImg((img.getAttribute('back_src') || img.src));
            imgSrcs.push({
                src: bigImgSrc,
                group: '主图',
                indexName: '主图_' + __PrefixZero(indexNum++,3),
                groupIndex: 0,
            });
        });
        indexNum = 1;
        var descImg = document.querySelectorAll('#commDesc img');
        descImg.forEach(function (img) {
            imgSrcs.push({
                src: getBigImg(img.getAttribute('item_init_src') || img.src),
                group: '详情',
                indexName: '详情_' + __PrefixZero(indexNum++,3),
                groupIndex: 2,
            });
        });
        if (descImg.length === 0) {
            document.querySelectorAll('#commDesc .ssd-module-mobile-wrap div').forEach(div => {
                var bg = window.getComputedStyle(div, null).getPropertyValue('background-image');
                var match = /url\(\s*?['"]?\s*?(\S+?)\s*?["']?\s*?\)/.exec(bg);
                if (match) {
                    imgSrcs.push({
                        group: '详情',
                        src: match[1],
                        indexName: '详情_' + __PrefixZero(indexNum++,3),
                        groupIndex: 2,
                    });
                }
            })
        }

    }
    for (var i = 0; i < imgSrcs.length; i++) {
        if (imgSrcs[i].src.match('blank.gif')) continue;
        send(imgSrcs[i]);
    }
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();

