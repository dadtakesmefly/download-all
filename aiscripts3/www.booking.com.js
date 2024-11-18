
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
    script.innerText = 'localStorage.__hotelPhotos = JSON.stringify(window.booking.env.hotelPhotos);';
    document.body.appendChild(script);
    if(localStorage.__hotelPhotos){
        var __hotelPhotos = JSON.parse(localStorage.__hotelPhotos);
        __hotelPhotos.forEach(function(photoItem){
            send(photoItem.highres_url || photoItem.large_url)
        });
    }else{
        var imgs = document.querySelectorAll('img');
        imgs.forEach(function(img){
            send(img.src);
        });
    }
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();
