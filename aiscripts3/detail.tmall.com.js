plus.storage.setItem('imgs', '');
plus.storage.setItem('videos', '');
var groupIndex = 0;
function aiparser() {
    var imgList = [];
    var li = {};

    function send(img) {
        if(img.src.match('^//')){
            img.src = `https:${img.src}`;
        }
        if (!li[img.src]) {
            imgList.push({...img,url:img.src,title:document.title});
            li[img.src] = true;
        }
    }
    var itemImgs = document.querySelectorAll('.preview-slider img');
    var colorImgs = document.querySelectorAll('.items a');
    var descImgs = document.querySelectorAll('.module-desc img');
    var indexNum = 1;
    function __PrefixZero(num, n) {
        return (Array(n).join('0') + num).slice(-n);
    }
    itemImgs.forEach(function (img, index) {
        send({
            src: img.src,
            group: '主图',
            indexName: '主图_' + __PrefixZero(indexNum++,3),
            groupIndex: groupIndex++,
        })
    });
    indexNum = 1;
    colorImgs.forEach(function (aele, index) {
        var url = aele.baseURI;
        if (url) {
            send({
                src: url,
                group: 'SKU图片',
                indexName: 'SKU图片_' + __PrefixZero(indexNum++,3),
                groupIndex: groupIndex++,
            })
        }
    });
    indexNum = 1;
    descImgs.forEach(function (img, index) {
        var src = img.dataset.ksLazyload || img.src;
        if (!src.match('img-tmdetail.alicdn.com/tps/i3/T1BYd_XwFcXXb9RTPq-90-90.png') &&
            !src.match('spaceball.gif')) {
            send({
                src: src,
                group: '详情',
                indexName: '详情_' + __PrefixZero(indexNum++,3),
                groupIndex: groupIndex++,
            })
        }
    });
    if (imgList.length > 0) {
        var liststr = JSON.stringify(imgList);
        liststr = liststr.replace(/(^\[|\]$)/g, '') + ',';
        plus.storage.setItem('imgs', (plus.storage.getItem('imgs') || '') + liststr);
    }
}
aiparser();
