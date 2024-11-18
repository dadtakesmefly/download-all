plus.storage.setItem('imgs', '');
plus.storage.setItem('videos', '');
var groupIndex = 0;
function aiparser(tabInfo){
    if(top !== self){
        return;
    }
    var imgList = [];
    var li = {};

    function send(img) {
        if (!li[img.src]) {
            imgList.push({...img, url: img.src, title: document.title,type:'image'});
            li[img.src] = true;
        }
    }
    function __PrefixZero(num, n) {
        return (Array(n).join('0') + num).slice(-n);
    }
    if(location.href.match('goods\\d?.html')){
        var indexNum = 1;
        var script = document.createElement('script');
        script.innerText = 'localStorage.fatkun_rawData = JSON.stringify(window.rawData);';
        document.body.appendChild(script);
        var rawData = JSON.parse(localStorage.fatkun_rawData);
        var goods = rawData.store.initDataObj.goods;
        goods.topGallery.forEach(function(item){
            var src = item.url || item;
            if(!src.match('^http')){
                src = location.protocol + src;
            }
            send({
                src: src,
                group: '主图',
                indexName: '主图_' + __PrefixZero(indexNum++,3),
                groupIndex: groupIndex++,
            })
        });
        indexNum = 1;
        goods.skus.forEach(function(item){
            var src = item.thumbUrl;
            if(!src.match('^http')){
                src = location.protocol + src;
            }
            send({
                src: src,
                group: 'SKU',
                indexName: 'SKU图片_' + __PrefixZero(indexNum++,3),
                groupIndex: groupIndex++,
            })
        });
        indexNum = 1;
        goods.detailGallery.forEach(function(item){
            var src = item.url;
            if(!src.match('^http')){
                src = location.protocol + src;
            }
            send({
                src: src,
                group: '详情',
                indexName: '详情_' + __PrefixZero(indexNum++,3),
                groupIndex: groupIndex++,
            })
        })
    }else if(location.href.match('goods_comments.html')){
        var reviewImgs = document.querySelectorAll('#goods-comments-list .oimage');
        if(reviewImgs.length > 0){
            reviewImgs.forEach(function(item){
                var src = item.style.backgroundImage.match('url\\("(.*)"\\)');
                if(src){
                    src = src[1].replace(/\?imageMogr2\/thumbnail.*/, '');
                    if(!src.match(/^http/)){
                        src = location.protocol + src;
                    }
                    send({
                        src:src
                    })
                }
            })
        }
    } else {
        if(document.querySelector('img[class="subject"]')){
            var indexNum = 1;
            document.querySelectorAll('img[class="subject"]').forEach(function(img){
                send({src:img.src,group:'主图',
                    indexName: '主图_' + __PrefixZero(indexNum++,3),
                    groupIndex: groupIndex++,});
            });
            document.querySelectorAll('.goods-group .goods img').forEach(function(img){
                send({src:img.src,group:'主图',
                    indexName: '主图_' + __PrefixZero(indexNum++,3),
                    groupIndex: groupIndex++,});
            });
        }else{
            document.querySelectorAll('img').forEach(function(img){
                send(img.src);
            });
        }
    }

    if (imgList.length > 0) {
        var liststr = JSON.stringify(imgList);
        liststr = liststr.replace(/(^\[|\]$)/g, '') + ',';
        plus.storage.setItem('imgs', (plus.storage.getItem('imgs') || '') + liststr);
    }
}
aiparser();
