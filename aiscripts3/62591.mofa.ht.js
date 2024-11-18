function aiparser() {
    var imgList = [];
    var li = {};
    function send(img){
        if (!li[img.src]) {
            imgList.push({...img,url:img.src,title:document.title});
            li[img.src] = true;
        }
    }
    chrome.runtime.sendMessage({
        tip: 'SET_GROUPS',
        groups: [
            '主图',
            '详情',
        ]
    });
    var indexNum = 1;
    function __PrefixZero(num, n) {
        return (Array(n).join('0') + num).slice(-n);
    }
    var mainImgs = document.querySelectorAll('.more-views img');
    mainImgs.forEach(function (img, index) {
        if(index > 0) return;
        send({
            src: img.src.split("\?")[0],
            group: '主图',
            indexName: '主图_' + __PrefixZero(indexNum++,3),
            groupIndex: 0,
        })
    });

    indexNum = 1;
    var detailImgs = document.querySelectorAll('#extra_tabs_description_contents .std img');
    detailImgs.forEach(function (img) {
        send({
            src: img.dataset.original || img.src,
            group: '详情',
            indexName: '详情_' + __PrefixZero(indexNum++,3),
            groupIndex: 2,
        })
    });
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();

