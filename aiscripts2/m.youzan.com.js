function aiparser(tabInfo) {
    var imgList = [];
    var li = {};

    function send(img) {
        if (!li[img.src]) {
            imgList.push({...img,url:img.src,title:document.title});
            li[img.src] = true;
        }
    }
    var imgSrcs = [];
    var bigImgSrc = '';
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
    document.querySelectorAll('.van-swipe-item img').forEach(function (img) {
        bigImgSrc = img.src.replace(/\/n\d+\//, '/imgzone/').replace(/s\d+x\d+_jfs/, 'jfs').replace(/!cc_50x64.jpg$/, '');
        imgSrcs.push({
            src: img.src,
            group: '主图',
            indexName: '主图_' + __PrefixZero(indexNum++,3),
            groupIndex: 0,
        });
    });
    indexNum = 1;
    document.querySelectorAll('.goods-detail-tab img').forEach(function (img) {
        imgSrcs.push({
            src: img.dataset.src || img.src,
            group: '详情',
            indexName: '详情_' + __PrefixZero(indexNum++,3),
            groupIndex: 2,
        });
    });
    indexNum = 1;
    document.querySelectorAll('.sku-bar__imgs img').forEach(function (img) {
        imgSrcs.push({
            src: img.dataset.src || img.src,
            group: 'SKU图片',
            indexName: 'SKU图片_' + __PrefixZero(indexNum++,3),
            groupIndex: 1,
        });
    });
    if (imgSrcs.length === 0 && location.href.match('youzan.com')) {
        document.querySelectorAll('img').forEach(function (img) {
            imgSrcs.push({
                src: img.src
            });
        });
    }
    for (var i = 0; i < imgSrcs.length; i++) {
        if (imgSrcs[i].src.match('blank.gif')) continue;
        send(imgSrcs[i]);
    }
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();

