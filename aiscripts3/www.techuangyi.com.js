function aiparser(tabInfo) {
    var imgList = [];
    var li = {};

    function send(img) {
        if (!li[img.src]) {
            imgList.push({...img,url:img.src,title:document.title});
            li[img.src] = true;
        }
    }
    var imgSrcs = [];
    document.querySelectorAll('img').forEach(function (img) {
        imgSrcs.push({
            src: img.dataset.original || img.src
        });
    });
    for (var i = 0; i < imgSrcs.length; i++) {
        send(imgSrcs[i]);
    }
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();

