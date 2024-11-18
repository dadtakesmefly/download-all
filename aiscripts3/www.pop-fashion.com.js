function aiparser(tabInfo) {
    var imgList = [];
    var li = {};

    function send(img) {
        if (!li[img.src]) {
            imgList.push({...img, url: img.src, title: document.title});
            li[img.src] = true;
        }
    }
    document.querySelectorAll('.report-box').forEach(report => {
        send({
            src: report.dataset.src,
            alt: report.dataset.id,
        });
    });
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();

