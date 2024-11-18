var localhref = '';
const VMProvider = class {
    constructor() {
        this.ids = {};
    }
    search() {
        const a = $(".player_container");
        if (!a.length) return;
        const b = a[0].id.replace("clip_", "");
        b && !this.ids[b] && this.getVideoData(b)
    }

    getVideoData(a) {
        chrome.runtime.sendMessage({tip: "makeXHRrequest", url: `https://player.vimeo.com/video/${a}/config`}, c => {
            const d = $("h1.taFHO").text() || $("h1").text(), e = c.request.files.progressive, f = [];
            var sss = ["1080p", "720p", "480p", "360p", "240p"];
            for(var i = 0; i<sss.length;i++) {
                const b = e.find(b => b.quality === sss[i]);
                if (b) {
                    var row = {
                        type: 'video',
                        url: b.url,
                        title: document.title,
                        fileName: d,
                        superSpecialFileName: d,
                        bytSize: 0,
                        videoType: 'MP4',
                        isSelect: false
                    };
                    chrome.runtime.sendMessage({tip:'addVideoBg',row:row});
                    return;
                }
            }
        })
    }
};

var dmVMProvider = new VMProvider;
setInterval(()=>{
    if (window.location.href !== localhref) {
        localhref = window.location.href;
        dmVMProvider.search();
    }
},1000);