aiparser();

function aiparser() {
    if(top !== self){
        return;
    }
    var skuli = {};
    function send(img) {
        if (img.group === 'SKU图片') {
            if (skuli[img.src]) {
                return;
            } else {
                skuli[img.src] = true;
            }
        }
        chrome.runtime.sendMessage({tip:'resGrabberImgRow',row:{...img, url: img.src, title: document.title}});
    }
    function __PrefixZero(num, n) {
        return (Array(n).join('0') + num).slice(-n);
    }
    chrome.runtime.sendMessage({
        tip: 'SET_GROUPS',
        groups: [
            '主图',
            'SKU图片',
            '详情',
        ]
    });
    if (location.href.match('goods\\d?.html|goods.html')) {
        try {
            var script = document.createElement('script');
            script.innerText = 'localStorage.fatkun_rawData = JSON.stringify(window.rawData);';
            document.body.appendChild(script);
            var rawData = JSON.parse(localStorage.fatkun_rawData);
            var goods = rawData.store.initDataObj.goods;
            var mainIndex = 0;
            goods.topGallery.forEach(function (item) {
                var src = item.url || item;
                if (!src.match('^http')) {
                    src = location.protocol + src;
                }
                send({
                    src: src,
                    group: '主图',
                    indexName: '主图-' + __PrefixZero(mainIndex++, 2),
                    groupIndex: 0,
                })
            });
            var skuIndex = 0;
            goods.skus.forEach(function (item) {
                var src = item.thumbUrl;
                if (!src.match('^http')) {
                    src = location.protocol + src;
                }
                send({
                    src: src,
                    indexName: 'SKU-' + __PrefixZero(skuIndex++, 2) + '-' + (item.specs || []).map(spec => spec.spec_value).join('-'),
                    group: 'SKU图片',
                    groupIndex: 2,
                })
            });
            var detailIndex = 0;
            var oakData = rawData.store.initDataObj.oakData;
            oakData ? oakData.goods.decoration.forEach(item=>{
                    item.contents.forEach(c => {
                        send({
                            src: c.imgUrl,
                            indexName: '详情-' + __PrefixZero(detailIndex++, 2),
                            group: '详情',
                            groupIndex: 3,
                        })
                    })
                })
                :
                goods.detailGallery.forEach(function (item) {
                    var src = item.url;
                    if (!src.match('^http')) {
                        src = location.protocol + src;
                    }
                    send({
                        src: src,
                        indexName: '详情-' + __PrefixZero(detailIndex++, 2),
                        group: '详情',
                        groupIndex: 3,
                    })
                })
        } catch (e) {
            var pdduid = document.cookie.match('pdd_user_id=(\\d+)')[1];
            var accesstoken = document.cookie.match('PDDAccessToken=(.*?)(;|$)')[1];
            var params = location.search.substr(1).split('&');
            var pObj = {};
            params.forEach(p => {
                var _p = p.split('=');
                pObj[_p[0]] = _p[1];
            });
            fetch(`https://mobile.yangkeduo.com/proxy/api/api/oak/integration/render?pdduid=${pdduid}&is_back=1`, {
                method: 'POST',
                headers: {
                    accept: 'application/json, text/plain, */*',
                    'content-type': 'application/json;charset=UTF-8',
                    accesstoken: accesstoken
                },
                body: JSON.stringify({
                    client_time: Date.now(),
                    extend_map: {},
                    goods_id: parseInt(pObj.goods_id),
                    hostname: 'mobile.yangkeduo.com',
                    page_from: parseInt(pObj.page_from),
                    page_version: 7,
                    refer_page_sn: pObj.refer_page_sn
                })
            })
                .then(res => res.json())
                .then(data => {
                    var gallery = data.goods.gallery;
                    var mainImgs = gallery.filter(item => item.type == 1);
                    mainImgs.sort((a, b) => a.priority - b.priority);
                    var detailImgs = gallery.filter(item => item.type == 2);
                    detailImgs.sort((a, b) => a.priority - b.priority);

                    var others = gallery.filter(item => [1, 2, 6].indexOf(item.type) == -1);
                    var mainIndex = 0;
                    mainImgs.forEach(function (item) {
                        send({
                            src: item.url,
                            width: item.width,
                            height: item.height,
                            group: '主图',
                            indexName: '主图-' + __PrefixZero(mainIndex++, 2),
                            groupIndex: 0,
                        })
                    });
                    var detailIndex = 0;
                    detailImgs.forEach(function (item) {
                        send({
                            src: item.url,
                            width: item.width,
                            height: item.height,
                            group: '详情',
                            indexName: '详情-' + __PrefixZero(detailIndex++, 2),
                            groupIndex: 3,
                        })
                    });
                    data.sku && data.sku.sort((a, b) => a.priority - b.priority).forEach(item => {
                        send({
                            src: item.thumb_url+'?'+Date.now(),
                            indexName: "SKU-" + item.specs.map(s => s.spec_value).join('-'),
                            group: "SKU",
                            groupIndex: 1,
                        });
                    });
                    var otherIndex = 0;
                    others.forEach(function (item) {
                        if (item.url) {
                            send({
                                src: item.url,
                                width: item.width,
                                height: item.height,
                                group: '其他',
                                indexName: '其他-' + __PrefixZero(otherIndex++, 2),
                                groupIndex: 2,
                            })
                        }
                    })
                })
        }


    } else if (location.href.match('goods_comments.html')) {
        var reviewImgs = document.querySelectorAll('#goods-comments-list .oimage');
        if (reviewImgs.length > 0) {
            reviewImgs.forEach(function (item) {
                var src = item.style.backgroundImage.match('url\\("(.*)"\\)');
                if (src) {
                    src = src[1].replace(/\?imageMogr2\/thumbnail.*/, '').replace(/\?imageView.*/, '');
                    if (!src.match(/^http/)) {
                        src = location.protocol + src;
                    }
                    send({
                        src: src
                    })
                }
            })
        }
    } else if (location.href.match('mall_certificates.html')){
        var reviewImgs = document.querySelectorAll('div[style]');
        if (reviewImgs.length > 0) {
            reviewImgs.forEach(function (item) {
                var src = item.style.backgroundImage.match('url\\("(.*)"\\)');
                if (src) {
                    src = src[1].replace(/\?imageView.*/, '');
                    if (!src.match(/^http/)) {
                        src = location.protocol + src;
                    }
                    send({
                        src: src
                    })
                }
            })
        }
    }
}