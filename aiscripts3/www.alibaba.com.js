function aiparser() {

    var imgList = [];
    var li = {};

    function send(img) {
        if (img.src.match('^//')) {
            img.src = location.protocol + img.src;
        }
        if (!li[img.src]) {
            imgList.push({...img, url: img.src, title: document.title});
            li[img.src] = true;
        }
    }

    var indexNum = 1;

    function __PrefixZero(num, n) {
        return (Array(n).join('0') + num).slice(-n);
    }

    var itemImgs = document.querySelectorAll('.slider-container img');
    var colorImgs = document.querySelectorAll('.select-container-items img');
    var descImgs = document.querySelectorAll('.specifications-wrap img, [module-title="detailManyImage"] [resizemode="contain"]');
    //getComputedStyle(a[8],false)['background-image']
    itemImgs.forEach(function (img) {
        send({
            src: img.dataset.src || img.src,
            group: '主图',
            indexName: '主图_' + __PrefixZero(indexNum++, 3),
            groupIndex: 0,
        })
    });

    indexNum = 1;
    colorImgs.forEach(function (img) {
        send({
            src: img.src,
            group: 'SKU图片',
            indexName: 'SKU图片_' + __PrefixZero(indexNum++, 3),
            groupIndex: 1,
        })
    });
    indexNum = 1;
    descImgs.forEach(function (img) {
        send({
            src: img.dataset.src || img.src,
            group: '详情',
            indexName: '详情_' + __PrefixZero(indexNum++, 3),
            groupIndex: 2,
        })
    });
    console.log(imgList)
}

aiparser();


