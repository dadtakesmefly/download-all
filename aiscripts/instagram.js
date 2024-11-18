var INProvider = class {
    constructor() {
        this.INIT_CLASS = "dm_zcbuandjfhzhusaunbcuhasdnnzhu";
        this.ids = {};
    }
    search() {
        $(".v1Nh3.kIKUG").not("." + this.INIT_CLASS).each((a, b) => {
            const c = $(b);
            if (c.find(".coreSpriteVideoIconLarge").length) {
                const a = c.children("a").attr("href");
                a && !this.ids[a] && this.addVideo(a), c.addClass(this.INIT_CLASS)
            }
        }), $("article video").not("." + this.INIT_CLASS).each((a, b) => {
            const c = $(b), d = c.closest("article").find("a.c-Yi7").attr("href");
            d && !this.ids[d] && this.addVideo(d), c.addClass(this.INIT_CLASS)
        })
    }

    addVideo(a) {
        let c = "https://www.instagram.com" + a;
        c += c.includes("?") ? "&__a=1" : "?__a=1", fetch(c).then(a => a.json()).then(a => {
            if (!a.items[0].video_versions) return;
            const c = a.items[0].video_versions;
            let d;
            const e = c[0].url;
            try {
                d = a.items[0].user.username
            } catch (a) {
                d = "video"
            }
            var row = {
                type: 'video',
                url: e,
                title: document.title,
                fileName: d,
                superSpecialFileName: d,
                bytSize: 0,
                videoType: 'MP4',
                isSelect: false
            };
            chrome.runtime.sendMessage({tip:'addVideoBg',row:row});
        })
    }
};

var dmINProvider = new INProvider;
setInterval(()=>{dmINProvider.search()},1000);