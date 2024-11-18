
function aiparser() {

    var imgList = [];
    var li = {};
    function send(img){
        if(img.src.match('^//')){
            img.src = location.protocol+img.src;
        }
        if (!li[img.src]) {
            imgList.push({...img,url:img.src,title:document.title});
            li[img.src] = true;
        }
    }
    if (location.href.match('www.alibaba.com/product-detail/|alibaba.com/product')) {
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
        var itemImgs = document.querySelectorAll('img.J-slider-cover-item');
        var colorImgs = document.querySelectorAll('#skuWrap img');
        var descImgs = document.querySelectorAll('.icbu-pc-detailManyImage img, #J-rich-text-description img');
        itemImgs.forEach(function (img) {
            send({
                src: img.dataset.lazySrc || img.src,
                group: '主图',
                indexName: '主图_' + __PrefixZero(indexNum++,3),
                groupIndex: 0,
            })
        });

        indexNum = 1;
        colorImgs.forEach(function (img) {
            send({
                src: img.src,
                group: 'SKU图片',
                indexName: 'SKU图片_' + __PrefixZero(indexNum++,3),
                groupIndex: 1,
            })
        });
        indexNum = 1;
        descImgs.forEach(function (img) {
            send({
                src: img.dataset.src || img.src,
                group: '详情',
                indexName: '详情_' + __PrefixZero(indexNum++,3),
                groupIndex: 2,
            })
        });
    }
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();


