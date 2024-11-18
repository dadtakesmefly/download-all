function aiparser(tabInfo) {
    var imgList = [];
    var li = {};
    var tit = document.title;
    var productTitle = document.querySelector('.product-detail .d-name strong');
    if (productTitle) tit = productTitle.innerText;
    var artNum = document.querySelector('.value.ff-arial');
    var address = document.querySelectorAll('.shop-content li');
    if (artNum) tit += "___"+artNum.innerText;
    if (address.length > 0) {
        tit += "___";
        address.forEach(addre => {
            if (/产地|地址/.test(addre.innerText || '')) {
                tit += addre.querySelector('.text').innerText.replace(/\s|/g, '');
            }
        })
    }
    var price = document.querySelector('.product-detail .price-time-buyer .v-price.d-p .p-value .d-sale');
    if (price) tit +=  '___' + price.innerText;
    function send(img) {
        if(img.src.match('^//')){
            img.src = location.protocol + img.src;
        }
        img.src = img.src.replace(/_\d+x\d+.*/, '');
        if (!li[img.src]) {
            imgList.push({...img,url:img.src,title:tit});
            li[img.src] = true;
        }
    }
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
    var itemImgs = document.querySelectorAll('.owl-item img');
    var colorImgs = document.querySelectorAll('.color-choice img');
    var descImgs = document.querySelectorAll('.d-content img');
    itemImgs.forEach(function (img) {
        send({
            src: img.getAttribute('big') || img.src,
            group: '主图',
            indexName: '主图_' + __PrefixZero(indexNum++,3),
            groupIndex: 0,
        })
    });
    indexNum = 1;
    colorImgs.forEach(function (img) {
        send({
            src: img.getAttribute('big') || img.src,
            group: 'SKU图片',
            indexName: 'SKU图片_' + __PrefixZero(indexNum++,3),
            groupIndex: 1,
        })
    });
    indexNum = 1;
    descImgs.forEach(function (img) {
        var src = img.dataset.original || img.src;
        send({
            src: img.getAttribute('big') || src,
            group: '详情',
            indexName: '详情_' + __PrefixZero(indexNum++,3),
            groupIndex: 2,
        })
    });
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();
