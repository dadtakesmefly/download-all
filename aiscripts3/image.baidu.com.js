function aiparser(){
    var imgList = [];
    var li = {};

    function send(img) {
        if (!li[img.src]) {
            imgList.push({...img, url: img.src, title: document.title});
            li[img.src] = true;
        }
    }
    if(location.href.match(/image.baidu.com\/search\/index/)){
        document.querySelectorAll('.imgitem').forEach(function(item){
            send({
                src: item.dataset.objurl,
                smallUrl: item.dataset.thumburl,
            });
        });
    }else{
        document.querySelectorAll('img').forEach(function(img){
            send({
                src: img.src
            });
        });
    }
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();
