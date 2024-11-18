function aiparser() {
    function processSrc(src) {
        return src.replace(/^\/\//, 'https://').replace(/thumbnail\d.coupangcdn.com\/thumbnails\/remote\/48x48ex\//, 'image7.coupangcdn.com/')
    }

    var imgSrcs = [];
    if (location.href.match('www.coupang.com/vp/products')) {
        chrome.runtime.sendMessage({
            tip: 'SET_GROUPS',
            groups: [
                'Main',
                'Detail'
            ]
        });
        var mainIndex = 1;
        document.querySelectorAll('.prod-image__items img').forEach(function (img) {
            imgSrcs.push({
                url: processSrc(img.dataset.src || img.src),
                group: 'Main',
                groupIndex: 0,
                indexName: 'Main-' + mainIndex++,
            });
        });
        var detailIndex = 1;
        document.querySelectorAll('#productDetail img').forEach(function (img) {
            imgSrcs.push({
                url: processSrc(img.dataset.original || img.src),
                group: 'Detail',
                groupIndex: 1,
                indexName: 'Detail-' + detailIndex++,
            });
        });
    } else {
        document.querySelectorAll('img').forEach(function (img) {
            imgSrcs.push({
                url: img.src
            });
        });
    }
    chrome.runtime.sendMessage({tip: 'resGrabberImgList', list: imgSrcs});
}

aiparser();