function aiparser() {
    if (self != top) return;
    var groupIndex = 0;

    function send(img) {
        chrome.runtime.sendMessage({
            tip:'resGrabberImgRow',
            row:{url: img.src, title: document.title, groupIndex: groupIndex++}
        });
    }

    var total = document.getElementById('range-seq');
    var imgSrc = document.querySelector('meta[property="og:image"]').content;
    imgSrc = location.origin + imgSrc;
    var i = 1;
    if (total) {
        total = parseInt(total.max);
        dd();
    }
    function dd() {
        send({
            src: imgSrc.replace(/seq=\d+/, `seq=${i}`),
        });
        if (i++ <= total) {
            setTimeout(dd, 500);
        }
    }
}
aiparser();
