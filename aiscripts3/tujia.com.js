
function aiparser(){
    var imgList = [];
    var li = {};

    function send(src,group) {
        if (!li[src]) {
            imgList.push({url:src,title:document.title,group:group});
            li[src] = true;
        }
    }
    var imgs = document.querySelectorAll('.detail-pictures li');
    if(imgs.length === 0){
        imgs = document.querySelectorAll('img');
        imgs.forEach(function(img){
            send(img.dataset.src || img.src);
        });
    } else {
        imgs.forEach(doc => {
            var img = doc.querySelector('img');
            send((img.dataset.src || img.src),doc.querySelector('span').innerHTML)
        })
    }
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}

aiparser();

