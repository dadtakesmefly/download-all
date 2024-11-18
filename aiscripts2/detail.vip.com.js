function aiparser(){
    var imgList = [];
    var li = {};

    function send(img) {
        if (!li[img.src]) {
            imgList.push({...img,url:img.src.replace(/^\/\//, 'https://'),title:document.title});
            li[img.src] = true;
        }
    }
    var imgSrcs = [];
    if(location.href.match('detail.vip.com')){
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
        document.querySelectorAll('.pic-slider-items img').forEach(function (img) {
            imgSrcs.push({
                src: img.dataset.original || img.src,
                group: '主图',
                indexName: '主图_' + __PrefixZero(indexNum++,3),
                groupIndex: 0,
            });
        });
        indexNum = 1;
        document.querySelectorAll('.color-list-item img').forEach(function(img){
            imgSrcs.push({
                src: img.dataset.original || img.src,
                group: 'SKU图片',
                indexName: 'SKU图片_' + __PrefixZero(indexNum++,3),
                groupIndex: 1,
            })
        });
        indexNum = 1;
        document.querySelectorAll('.dc-img-detail img').forEach(function (img) {
            imgSrcs.push({
                src: img.dataset.original || img.src,
                group: '详情',
                indexName: '详情_' + __PrefixZero(indexNum++,3),
                groupIndex: 2,
            });
        });
        for (var i = 0; i < imgSrcs.length; i++) {
            if (imgSrcs[i].src.match('blank.gif')) continue;
            send(imgSrcs[i]);
        }
    }else{
        if(location.href.match('vis.vip.com'))return;
        document.querySelectorAll('img').forEach(function(img){
            send({
                src: img.src
            });
        });
    }
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();
