function aiparser(tabInfo){
    var imgList = [];
    var li = {};

    function send(src) {
        if (!li[src]) {
            imgList.push({url:src,title:document.title});
            li[src] = true;
        }
    }
    var imgs = document.querySelectorAll('.images-container img.thumb');
    if(imgs.length > 0){
        imgs.forEach(function(img){
            send(img.src.replace('-home_', '-large_'));
        });
    }else{
        imgs = document.querySelectorAll('img');
        imgs.forEach(function(img){
            send(img.src.replace('-home-', '-large-'));
        });
    }
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();
