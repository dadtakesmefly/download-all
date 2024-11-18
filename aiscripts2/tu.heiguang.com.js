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
    var imgs = document.querySelectorAll('.show-img-item img');
    if(imgs.length === 0){
        imgs = document.querySelectorAll('img');
    }
    imgs.forEach(function(img){
        send(img.src);
    });
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();

