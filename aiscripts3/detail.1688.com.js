plus.storage.setItem('imgs', '');
plus.storage.setItem('videos', '');
var groupIndex = 0;
var groupSKUIndex = 2000;
var groupDescIndex = 4000;

function aiparser() {
    var imgList = [];
    var li = {};

    function send(img) {
        if (!li[img.src]) {
            imgList.push({...img, url: img.src, title: document.title});
            li[img.src] = true;
        }
    }

    var indexNum = 1;
    var indexSKUNum = 1;

    function __PrefixZero(num, n) {
        return (Array(n).join('0') + num).slice(-n);
    }

    var itemImgs = document.querySelectorAll('.swipe-pane img');
    var colorImgs = document.querySelector('#widget-wap-detail-common-footer script');
    var descImgs = document.querySelectorAll('.detail-description-content img');
    if (colorImgs) {
        try {
            colorImgs = JSON.stringify(JSON.parse(colorImgs.innerText).skuProps);
        } catch (e) {
        }
    }
    itemImgs.forEach(function (img) {
        var url = img.getAttribute('swipe-lazy-src') || img.src;
        if (colorImgs && colorImgs.indexOf(url) > -1) {
            send({
                src: url,
                group: 'SKU',
                indexName: 'SKU图片_' + __PrefixZero(indexSKUNum++, 3),
                groupIndex: groupSKUIndex++,
            })
        } else {
            send({
                src: url,
                group: '主图',
                indexName: '主图_' + __PrefixZero(indexNum++, 3),
                groupIndex: groupIndex++,
            })
        }
    });
    indexNum = 1;
    descImgs.forEach(function (img) {
        send({
            src: img.src,
            group: '详情',
            indexName: '详情_' + __PrefixZero(indexNum++, 3),
            groupIndex: groupDescIndex++,
        })
    });
    // console.log(imgList)
    if (imgList.length > 0) {
        var liststr = JSON.stringify(imgList);
        liststr = liststr.replace(/(^\[|\]$)/g, '') + ',';
        plus.storage.setItem('imgs', (plus.storage.getItem('imgs') || '') + liststr);
    }
}

aiparser();

