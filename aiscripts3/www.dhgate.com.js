
function aiparser(tabInfo){
    var imgList = [];
    var li = {};

    function send(img) {
        if(img.src.match(/^\/\//)){
            img.src = location.protocol+img.src;
        }
        if (!li[img.src]) {
            imgList.push({...img,url:img.src,title:document.title});
            li[img.src] = true;
        }
    }
    if(location.href.match('www.dhgate.com/product')){
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
        var itemImgs = document.querySelectorAll('#simgListH img');
        var colorImgs = document.querySelectorAll('.color-list img');
        var descImgs = document.querySelectorAll('.dec-img-list #imglist img');
        var src;
        itemImgs.forEach(function(img){
            src = img.src.replaceAll('100x100','0x0');
            send({
                src: src,
                group: '主图',
                indexName: '主图_' + __PrefixZero(indexNum++,3),
                groupIndex: 0,
            })
        });
        indexNum = 1;
        colorImgs.forEach(function(img){
            send({
                src: img.src,
                group: 'SKU图片',
                indexName: 'SKU图片_' + __PrefixZero(indexNum++,3),
                groupIndex: 1,
            })
        });
        indexNum = 1;
        descImgs.forEach(function(img){
            send({
                src: img.src,
                group: '详情',
                indexName: '详情_' + __PrefixZero(indexNum++,3),
                groupIndex: 2,
            })
        });
        var videos = document.querySelectorAll('.bimg-inner');
        if(videos[0] && videos[0].dataset && videos[0].dataset.videourl) {
            chrome.runtime.sendMessage({tip: 'addVideoBg', row: {
                    type: 'video',
                    url: videos[0].dataset.videourl,
                    fileName: videos[0].dataset.videourl.split('/').slice(-1),
                    bytSize: 0,
                    videoType: '',
                    isSelect: false
                }});
        }
    } else {
        document.querySelectorAll('img').forEach(function(img){
            send({
                src: img.src,
            })
        });
        const srcChecker = /url\(\s*?['"]?\s*?(\S+?)\s*?["']?\s*?\)/i;
        const pseudo = [null,'before','after','hover'];
        for (let el of Array.from(document.querySelectorAll('*'))) {
            pseudo.forEach(t => {
                let prop = window.getComputedStyle(el, t).getPropertyValue('background-image');
                let match = srcChecker.exec(prop);
                if (match) {
                    send({
                        type: 'image',
                        src: match[1]
                    });
                }
            })
        }
    }
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();


