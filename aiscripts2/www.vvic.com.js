function aiparser(tabInfo) {
    var imgList = [];
    var li = {};
    var tit = document.title;
    var productTitle = document.querySelector('.detail-name .detail-title');
    if (productTitle) tit = productTitle.innerText;
    var artNum = document.querySelector('.detail-info .detail-info-line');
    var address = document.querySelectorAll('.shop-wrapper dd,.shop-wrapper dt');
    if (artNum) {
        artNum = artNum.innerText.split('\n');
        for (let i = 0;i<artNum.length;i++) {
            if (/货号/.test(artNum[i] || '')) {
                tit += "___" + artNum[++i].replace(/\s|/g, '');
            }
        }
    }
    if (address.length > 0) {
        tit += "___";
        for (let i = 0;i<address.length;i++) {
            if (/产地|地址/.test(address[i].innerText || '')) {
                tit += address[++i].innerText.replace(/\s|/g, '');
            }
        }
    }
    var price = document.querySelector('.price.price-red');
    if (price) {
        price = price.innerText.split(/[\n\s*\r]/);
        price = price[price.length-1];
        tit += "___"+price;
    }
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
    var descImgs = document.querySelectorAll('.detail-desc img');
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
