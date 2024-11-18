function aiparser() {
    var imgList = [];
    var li = {};

    function send(img) {
        if (!li[img.src]) {
            imgList.push({...img, url: img.src, title: document.title});
            li[img.src] = true;
        }
    }

    if (location.href.match('store/product|/item/')) {
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
        var itemImgs = document.querySelectorAll('#j-image-thumb-list img, .images-view-list img');
        itemImgs.forEach(function (img) {
            send({
                src: img.src,
                group: '主图',
                indexName: '主图_' + __PrefixZero(indexNum++,3),
                groupIndex: 0,
            });
        });
        indexNum = 1;
        var skuImgs = document.querySelectorAll('#j-sku-list-1 img,.sku-property-list img');
        skuImgs.forEach(function (img) {
            send({
                src: img.src,
                group: 'SKU图片',
                indexName: 'SKU图片_' + __PrefixZero(indexNum++,3),
                groupIndex: 1,
            });
        });
        indexNum = 1;
        var descImgs = document.querySelectorAll('.description-content img, #product-description img');
        descImgs.forEach(function (img) {
            send({
                src: img.src,
                group: '详情',
                indexName: '详情_' + __PrefixZero(indexNum++,3),
                groupIndex: 2,
            });
        });
        chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
    } else {
        return [];
    }
}

aiparser();
