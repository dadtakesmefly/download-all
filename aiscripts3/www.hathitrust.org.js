function aiparser() {
    var imgList = [];
    var li = {};

    function send(img) {
        if (!li[img.src]) {
            imgList.push({...img, url: img.src, title: document.title});
            li[img.src] = true;
        }
    }

    var total = document.querySelector('[data-slot="total-seq"]');
    var imgSrc = document.querySelector('.viewer-inner img').src;
    if (total) {
        total = parseInt(total.textContent);
        for (var i = 1; i <= total; i++) {
            send({
                src: imgSrc.replace(/seq=\d+/, `seq=${i}`),
            })
        }
    }
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();
