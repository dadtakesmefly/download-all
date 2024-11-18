function aiparser(tabInfo){
    var imgList = [];
    var li = {};

    function send(src) {
        if (!li[src]) {
            imgList.push({url:src,title:document.title});
            li[src] = true;
        }
    }
    var imgs = document.querySelectorAll('#viewer-img img');
    if(imgs.length > 0){
        imgs.forEach(function(img){
            send(img.dataset.original || img.src);
        });
    }else{
        document.querySelectorAll('img').forEach(function(img){
            send(img.src);
        });
    }
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();
