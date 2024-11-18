function aiparser(tabInfo){
    var imgList = [];
    var li = {};

    function send(src) {
        if (!li[src]) {
            imgList.push({url:src,title:document.title});
            li[src] = true;
        }
    }
    var imgs = document.querySelectorAll('.ProductStyles-fieldset img');
    if(imgs.length === 0){
        imgs = document.querySelectorAll('img');
    }
    imgs.forEach(function(img){
        send(img.dataset.src || img.src);
    });
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}

aiparser();


