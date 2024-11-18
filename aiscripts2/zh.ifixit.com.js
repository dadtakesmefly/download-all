
function aiparser(){
    var imgList = [];
    var li = {};

    function send(img) {
        if (!li[img.src]) {
            imgList.push({...img,url:img.src,title:document.title});
            li[img.src] = true;
        }
    }
    var thumbnails = document.querySelectorAll('.product-page-thumbnail-static');
    if(thumbnails.length === 0){
        thumbnails = document.querySelectorAll('#MainProductImage');
    }
    if(thumbnails.length > 0){
        thumbnails.forEach(function(thumbnail){
            send({
                src: thumbnail.dataset.zoomsrc
            })
        })
    }else if (location.href.match('zh.ifixit.com/Store')) {
        document.querySelectorAll('img').forEach(function(img){
            send({
                src: img.src,
            })
        })
    }
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();
