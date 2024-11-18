function aiparser(tabInfo){
    var imgList = [];
    var li = {};
    var groupIndex = 0;

    function send(src) {
        if (!li[src]) {
            imgList.push({url:src,title:document.title,groupIndex:groupIndex++});
            li[src] = true;
        }
    }
    var imgs = document.querySelectorAll('.cc_thumbs_item img');
    if(imgs.length === 0){
        imgs = document.querySelectorAll('img');
    }
    imgs.forEach(function(img){
        send(img.src.replaceAll('_W120.','_W1920.'));
    });
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();



