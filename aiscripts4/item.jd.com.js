var groupIndex = 0;
function aiparser() {
    function send(img) {
        var src = img.src.replace(/^(https?:)/, 'https:');
        if (src.match('^//')) {
            src = location.protocol + src;
        }
        img.url = src.replace('!cc_60x76.jpg', '');
        window.InterfaceName.addTaobaoImg(img.url,img.group,img.indexName,img.groupIndex);
    }

    var imgSrcs = [];
    var indexNum = 1;

    function __PrefixZero(num, n) {
        return (Array(n).join('0') + num).slice(-n);
    }

    var bigImgSrc = '';
    document.querySelectorAll('.pic_list img').forEach(function (img) {
        imgSrcs.push({
            src: img.getAttribute('back_src') || img.src.replace(/^(https?:)/, 'https:'),
            group: '主图',
            indexName: '主图_' + __PrefixZero(indexNum++, 3),
            groupIndex: groupIndex++,
        });
    });
    indexNum = 1;
    document.querySelectorAll('#choose-attrs img').forEach(function (img) {
        imgSrcs.push({
            src: img.src,
            group: 'SKU',
            indexName: 'SKU图片_' + __PrefixZero(indexNum++, 3),
            groupIndex: groupIndex++,
        })
    });
    indexNum = 1;
    var style = document.querySelector('#commDesc style');
    if (style) {
        var patt1 = new RegExp(".ssd-module-mobile-wrap (.+?){.*?background-image:url\\((.+?)\\)", "g");
        var result = patt1.exec(style.innerText);
        while (result) {
            imgSrcs.push({
                src: result[2].replace(/^(https?:)/, 'https:'),
                group: '详情',
                indexName: '详情_' + __PrefixZero(indexNum++, 3),
                groupIndex: groupIndex++,
            });
            result = patt1.exec(style.innerText);
        }
    }
    document.querySelectorAll('#commDesc img').forEach(function (img) {
        imgSrcs.push({
            src: img.src,
            group: '详情',
            indexName: '详情_' + __PrefixZero(indexNum++, 3),
            groupIndex: groupIndex++,
        });
    });
    const li = [];
    const lis = {};
    for (var i = 0; i < imgSrcs.length; i++) {
        if (imgSrcs[i].src.match('blank\.(gif|png)')) continue;
        send(imgSrcs[i]);
        if (!lis[imgSrcs[i].src]) {
            li.push(imgSrcs[i]);
            lis[imgSrcs[i].src] = true;
        }
    }
    return li.length;
}

aiparser();