function aiparser() {
    if (self != top) {
        return;
    }
    var indexNum = 1;
    var imgList = [];
    var li = {};

    function send(img) {
        if (location.href.indexOf('xiapibuy') > -1) {
            img.url = 'https://cf.shopee.com.my/file/' + img.url;
        } else {
            img.url = window.location.origin + '/file/' + img.url;
            img.url = img.url.replace("//", '//cf.');
        }
        imgList.push({...img, title: document.title});
    }


    var itemId, shopId;
    if (location.href.indexOf('product') > -1) {
        var ids = location.href.split("?")[0].replace(/.*?\/(\d+\/\d+)$/, '$1');
        ids = ids.split('/');
        shopId = ids[0];
        itemId = ids[1];
    } else {
        var ids = location.href.split("?")[0].replace(/.*?\.(\d+\.\d+)$/, '$1');
        ids = ids.split('.');
        shopId = ids[0];
        itemId = ids[1];
    }
    chrome.runtime.sendMessage({
        tip: 'SET_GROUPS',
        groups: [
            'MAIN',
            'SKU',
        ]
    });

    function __PrefixZero(num, n) {
        return (Array(n).join('0') + num).slice(-n);
    }

    chrome.runtime.sendMessage({
        tip: 'makeXHRrequest',
        url: window.location.origin + '/api/v4/item/get?itemid=' + itemId + '&shopid=' + shopId,
        config: {},
        responseType: ''
    }, (re) => {
        var ress = JSON.parse(re);
        ress.data.images.forEach(d => {
            send({
                url: d,
                group: 'MAIN',
                indexName: 'MAIN_' + __PrefixZero(indexNum++, 3),
                groupIndex: 0,
            })
        });
        indexNum = 1;
        try {
            ress.data.tier_variations[0].images.forEach(d => {
                send({
                    url: d,
                    group: 'SKU',
                    indexName: 'SKU_' + __PrefixZero(indexNum++, 3),
                    groupIndex: 0,
                })
            });
        } catch (e) {
        }
        chrome.runtime.sendMessage({tip: 'resGrabberImgList', list: imgList});
    });
}

aiparser();
