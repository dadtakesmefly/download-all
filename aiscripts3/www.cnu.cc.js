function aiparser(tabInfo){
    var imgList = [];
    var li = {};

    function send(src) {
        if (!li[src]) {
            imgList.push({url: src, title: document.title});
            li[src] = true;
        }
    }
    var imgEles = document.querySelectorAll('.bodyImg');
    if(imgEles.length > 0){
        imgEles.forEach(function(img){
            send(img.dataset.original);
        })
    }else{
        document.querySelectorAll('img').forEach(function(img){
            send(img.src);
        });
    }
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();

