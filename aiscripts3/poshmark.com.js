function aiparser(){
    var imgList = [];
    var li = {};
    function send(img){
        if (!li[img.src]) {
            imgList.push({...img,url:img.src,title:document.title});
            li[img.src] = true;
        }
    }
    document.querySelectorAll('.carousel-vertical__inner img').forEach(function(img){
        var bigSrc = (img.dataset.src || img.src).replace('/s_', '/l_');
        send({src:bigSrc});
    });
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();

