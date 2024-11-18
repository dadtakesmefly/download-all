function aiparser(){
    var imgList = [];
    var li = {};
    var groupIndex = 0;

    function send(src) {
        if (!li[src]) {
            imgList.push({url:src,title:document.title,groupIndex:groupIndex++});
            li[src] = true;
        }
    }
    document.querySelectorAll('.picChoose img, .WB_pic img').forEach(function(img){
        send(img.src);
    });
    document.querySelectorAll('[class*="picture_item"] img').forEach(function(img){
        send(img.src);
    });
    document.querySelectorAll('[class*="Viewer_prevList"] img').forEach(function(img){
        send(img.src);
    });
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();

