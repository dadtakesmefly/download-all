function aiparser(tabInfo) {
    var imgList = [];

    function send(src) {
        imgList.push({url: src, title: document.title});
    }
    if(location.href.match('book.yunzhan365.com|www.yunzhan365.com/read')){
        var pageCount = document.querySelector('#currentPageIndexTextField').value.split('/')[1];
        pageCount = parseInt(pageCount);
        for (var i = 1; i <= pageCount; i++) {
            send(location.href.replace(/mobile\/index.html.*/, '') + `files/mobile/${i}.jpg`)
        }
    }
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();

