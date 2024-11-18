function aiparser() {
    var imgList = [];
    var li = {};

    function send(img) {
        if (!li[img.src]) {
            imgList.push({...img, url: img.src, title: document.title});
            li[img.src] = true;
        }
    }

    if (location.href.match('detail.1688.com')) {
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
        var itemImgs;
        var colorImgs;
        var descImgs;
        itemImgs = document.querySelectorAll('#dt-tab img');
        if (itemImgs.length === 0) {
            itemImgs = document.querySelectorAll('.img-list-wrapper img');
            descImgs = document.querySelectorAll('.content-detail img');
        } else {
            colorImgs = document.querySelectorAll('.obj-leading img,.table-sku img');
            descImgs = document.querySelectorAll('.de-description-detail img');
        }
        itemImgs && itemImgs.forEach(function (img) {
            send({
                src: img.dataset.lazySrc || img.src,
                group: '主图',
                indexName: '主图_' + __PrefixZero(indexNum++, 3),
                groupIndex: 0,
            })
        });
        indexNum = 1;
        colorImgs && colorImgs.forEach(function (img) {
            send({
                src: img.src,
                group: 'SKU图片',
                indexName: 'SKU图片_' + __PrefixZero(indexNum++, 3),
                groupIndex: 1,
            })
        });
        indexNum = 1;
        descImgs && descImgs.forEach(function (img) {
            send({
                src: img.src,
                group: '详情',
                indexName: '详情_' + __PrefixZero(indexNum++, 3),
                groupIndex: 2,
            })
        });
        if (descImgs.length === 0) {
            var tfsUrl = document.querySelector('#desc-lazyload-container').dataset.tfsUrl;
            if (tfsUrl) {
                chrome.runtime.sendMessage({
                    cmd: 'NET',
                    settings: {
                        url: tfsUrl,
                    }
                }, function (res) {
                    if (res.status === 'ok') {
                        var result = res.data.match(/https:\/\/cbu01.alicdn.com\/img[^ ]*?\.jpg/g);
                        if (result) {
                            result.forEach(function (img) {
                                send({
                                    src: img,
                                    group: '详情',
                                    indexName: '详情_' + __PrefixZero(indexNum++, 3),
                                    groupIndex: 2,
                                });
                            });
                        }
                    }
                });
            }
        }
        if (location.href.match('detail.1688.com/pic')) {
            document.querySelectorAll('#dt-bp-tab-nav li[data-img]').forEach(function (item) {
                send({
                    src: item.dataset.img
                });
            });
        }
    } else {
        document.querySelectorAll('img').forEach(function (img, index) {
            send(img);
        });
    }
    chrome.runtime.sendMessage({tip: 'resGrabberImgList', list: imgList});
}

aiparser();

