
function aiparser(){
    var imgList = [];
    var li = {};
    function send(src){
        if (!li[src]) {
            imgList.push({url:src.split('?')[0],title:document.title});
            li[src] = true;
        }
    }
    var imgs = document.querySelectorAll('.thumbnail-image');
    if(imgs.length === 0){
        imgs = document.querySelectorAll('img');
    }
    imgs.forEach(function(img){
        send(img.src)
    });
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}

aiparser();
