function aiparser() {
    var imgList = [];
    var li = {};
    var groupIndex = 0;

    function send(img) {
        if (!li[img.src]) {
            imgList.push({...img, url: img.src, title: document.title,groupIndex:groupIndex++});
            li[img.src] = true;
        }
    }
    if(location.href.match('book.yunzhan365.com|www.yunzhan365.com/read')){
        var pageCount = document.querySelector('#currentPageIndexTextField').value.split('/')[1];
        pageCount = parseInt(pageCount);
        for (var i = 1; i <= pageCount; i++) {
            send({src:location.href.replace(/mobile\/index.html.*/, '') + `files/mobile/${i}.jpg`})
        }
    }
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();

