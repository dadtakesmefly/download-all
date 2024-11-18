function aiparser() {
    var imgList = [];
    var li = {};

    function send(img) {
        if (!li[img.src]) {
            imgList.push({...img,url:img.src,title:document.title});
            li[img.src] = true;
        }
    }
    if(!location.href.match('traveldetail.fliggy.com/item')){
        document.querySelectorAll('img').forEach(function(img){
            send({
                src: img.src
            })
        });
        chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
    }
    var itemImgs = document.querySelectorAll('.item-gallery-thumb img');
    var colorImgs = [];
    var descImgs = document.querySelectorAll('#J_Desc img');
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
    itemImgs.forEach(function (img, index) {
        send({
            src: img.src,
            group: '主图',
            indexName: '主图_' + __PrefixZero(indexNum++,3),
            groupIndex: 0,
        })
    });
    indexNum = 1;
    colorImgs.forEach(function (aele, index) {
        var url = aele.style.backgroundImage.match(/(\/\/.*)"/);
        if (url) {
            url = location.protocol + url[1];
            send({
                src: url,
                group: 'SKU图片',
                indexName: 'SKU图片_' + __PrefixZero(indexNum++,3),
                groupIndex: 1,
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
                groupIndex: 2,
            })
        }
    });
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();
