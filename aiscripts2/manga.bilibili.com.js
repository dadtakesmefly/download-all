var groupIndex = 0;

function aiparser(tabInfo) {
    if (self != top) return;

    function __PrefixZero(num, n) {
        return (Array(n).join('0') + num).slice(-n);
    }
    var h = location.href.split("?")[0];
    h = h.replace(/.*\/(\d+$)/,'$1');

    chrome.runtime.sendMessage({
        tip: 'makeXHRrequest',
        url: "https://manga.bilibili.com/twirp/comic.v1.Comic/GetImageIndex?device=pc&platform=web",
        config: {method: 'POST', body: '{"ep_id":'+h+'}', headers: {'content-type': "application/json;charset=UTF-8"}},
        responseType: ''
    }, e => {

        var ress = JSON.parse(e);
        if (ress.code === 0) {
            for (var b = 0; b < ress.data.images.length; b++) {
                aa(b);
            }
        }
        function aa(b) {
            chrome.runtime.sendMessage({
                tip: 'makeXHRrequest',
                url: "https://manga.bilibili.com/twirp/comic.v1.Comic/ImageToken?device=pc&platform=web",
                config: {
                    method: 'POST',
                    body: '{"urls":"[\\"' + ress.data.images[b].path + '\\"]"}',
                    headers: {'content-type': "application/json;charset=UTF-8"}
                },
                responseType: ''
            }, e2 => {
                var ress2 = JSON.parse(e2);
                chrome.runtime.sendMessage({
                    tip: 'resGrabberImgRow',
                    row: {
                        url: ress2.data[0].url + "?token=" + ress2.data[0].token,
                        title: document.title,
                        indexName: __PrefixZero(b + 1, 3),
                        groupIndex: b
                    }
                });
            })
        }
    });
}

aiparser();

