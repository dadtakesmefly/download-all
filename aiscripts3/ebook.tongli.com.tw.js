function aiparser(){
    var imgList = [];
    var li = {};
    var index = 0;
    function send(img){
        if (!li[img.src]) {
            imgList.push({...img,url:img.src,title:document.title.split('-')[0],groupIndex: index++});
            li[img.src] = true;
        }
    }
    document.querySelectorAll('#gallery-controls img').forEach(function(img){
        var bigSrc = (img.dataset.src || img.src);
        send({src:bigSrc});
    });
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();
