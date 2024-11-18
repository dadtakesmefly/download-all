(function () {
    var meta = document.querySelector('meta[name="microscope-data"]');
    var scripts = document.querySelectorAll('script');
    var imgVedioID;
    if (meta) {
        var userId = meta.content.match(/userid=(\d+);/);
        if (userId) {
            userId = userId[1];
            for (var i = 0; i < scripts.length; i++) {
                if (scripts[i].innerText) {
                    if (!imgVedioID) {
                        imgVedioID = scripts[i].innerText.match(/"videoId":"(\d+)"/);
                        if (imgVedioID) {
                            imgVedioID = imgVedioID[1];
                            var videoUrl = 'https://cloud.video.taobao.com/play/u/' + userId + '/p/1/e/6/t/1/' + imgVedioID + '.mp4';
                            chrome.runtime.sendMessage({tip: 'addVideoBg', row: {
                                    type: 'video',
                                    url: videoUrl,
                                    fileName: imgVedioID + '.mp4',
                                    bytSize: 0,
                                    videoType: '',
                                    isSelect: false
                                }});
                            break;
                        }
                    }
                }
            }
        }
    }
})();
