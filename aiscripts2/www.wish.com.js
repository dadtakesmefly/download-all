function aiparser(tabInfo){
    var imgList = [];
    var li = {};

    function send(src) {
        if (!li[src]) {
            imgList.push({url:src,title:document.title});
            li[src] = true;
        }
    }
    document.querySelectorAll('img').forEach(function(img){
        send(img.src.replace(/-(small|medium)\./, '-big.').replace('-tiny?', '-big?'));
    });
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();
