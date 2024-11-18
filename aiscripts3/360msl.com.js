function aiparser() {
    function send(img) {
        chrome.runtime.sendMessage({tip:'resGrabberImgRow',row:{...img,url:img.src,title:document.title}});
    }
    var imgs = document.querySelectorAll('a.ymzimgbox');
    if (imgs.length > 0) {
        imgs.forEach(function (img) {
            send({
                src: img.href,
            })
        })
    }
}

aiparser();
