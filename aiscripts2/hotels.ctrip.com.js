
function aiparser(){
    var imgList = [];
    var li = {};

    function send(src) {
        if (!li[src]) {
            imgList.push({url: src, title: document.title});
            li[src] = true;
        }
    }
    var script = document.createElement('script');
    script.innerText = 'localStorage.__hotelUpload = JSON.stringify(pictureConfigNew.hotelUpload);';
    document.body.appendChild(script);
    if(localStorage.__hotelUpload){
        var __hotelUpload = JSON.parse(localStorage.__hotelUpload);
        __hotelUpload.forEach(function(photoItem){
            var url = photoItem.max;
            if(url.match(/^\/\//)){
                url = location.protocol + url;
            }
            send(url, photoItem.name+'_'+photoItem.pid);
        });
    }else{
        imgs = document.querySelectorAll('img');
        imgs.forEach(function(img){
            send(img.src);
        });
    }
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();
