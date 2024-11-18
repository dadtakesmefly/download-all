function aiparser(tabInfo) {
    var imgList = [];
    var li = {};
    var groupIndex = 0;

    function send(src) {
        if (src.match('^//')) {
            src = location.protocol + src;
        }
        if (!li[src]) {
            imgList.push({url: src, title: document.title, referer: true, groupIndex: groupIndex++});
            li[src] = true;
        }
    }

    var pages = document.querySelector('#page_select');
    for (var i = 0; i < pages.length; i++) {
        send(pages[i].value);
    }
    chrome.runtime.sendMessage({
        tip: 'addRefererListener',
        url: "*://images.dmzj.com/*",
        referer: "https://manhua.dmzj.com/"
    }, () => {
        chrome.runtime.sendMessage({tip: 'resGrabberImgList', list: imgList});
    });
}

aiparser();
