var MCProvider = class {
    constructor() {
        this.ids = {}, this.videos = []
    }
    run() {
        setInterval(() => this.search(), 1e3)
        // this.search()
    }
    search() {
        if (chrome && chrome.app && typeof chrome.app.isInstalled !== "undefined") {
            chrome.runtime.sendMessage({
                tip: "metacafeVideo",
                title: document.title
            }, a => {
                let tmp = []
                let screen = document.getElementsByClassName("poster")
                if (screen.length) {
                    screen = screen[0].style.backgroundImage.match(/url\("(.*?)"\)/)[1]
                }
                if (a && a.length !== this.videos.length) {
                    a.forEach((b, i) => {
                        if (!b.url) return true;
                        var row = {
                            type: b.type,
                            url: b.url,
                            title: document.title,
                            fileName: document.title,
                            superSpecialFileName: "true",
                            bytSize: b.size,
                            videoType: 'MP4',
                            poster: screen,
                            videoIndex: Number(b.url.match(/_0+(.*?)\./)[1]) + 1,
                            isSelect: false
                        }
                        this.videos = a
                        tmp.push(row)

                    })
                    if (tmp.length) chrome.runtime.sendMessage({
                        tip: 'addVideoBg',
                        row: tmp
                    })
                }
            })
        }
    }
    addVideo(a, b) {
        this.ids[a] = !0, this.getVideoData(a, c => c.variants.length ? void this.getAllSizes(c.variants, d => {
            c.variants = d, this.videos = this.videos.concat(c), this.renderBtn(a, b)
        }) : console.warn("empty video variants!"))
    }
    getVideoData() {}
    renderBtn(a, b) {
        if (!RENDER_BTN_ON_VIDEO) return;
        const c = this.videos.find(b => b.vid === a);
        if (!c) return console.error("bad vid!");
        const d = c.variants.map(a => `
            <div class="mtz-download-btn-dropdown-item" quality="${a.quality}">${a.quality}</div>
        `).join("");
        $(`
            <button class="mtz-download-btn" vid="${a}">
                <span>Download</span>
                <div class="mtz-download-btn-dropdown">${d}</div>
            </button>
        `).appendTo(b).on("click", a => {
            a.stopPropagation(), this.download(a.target)
        })
    }
    getAllSizes(a, b) {
        if (!GET_FILE_SIZE) return b(a);
        const c = a.map(a => this.getFileSize(a.url));
        Promise.all(c).then(c => {
            a.forEach((b, d) => a[d].size = c[d]), b(a)
        })
    }
    getFileSize(a) {
        return new Promise(b => {
            const c = new XMLHttpRequest;
            c.open("HEAD", a, !0), c.onload = () => {
                if (200 === c.status) {
                    const a = +c.getResponseHeader("Content-Length");
                    return b(a)
                }
                b(0)
            }, c.onerror = () => b(0), c.send()
        })
    }
    getCookie(a) {
        var b = "; " + document.cookie,
            c = b.split("; " + a + "=");
        if (2 == c.length) return c.pop().split(";").shift()
    }
    betweenStr(a, b, c) {
        if (!b && !c) return a;
        let d = "";
        const e = a.indexOf(b);
        if (-1 === e && (d = ""), 0 <= e && (d = a.substr(e + b.length, a.length)), !c) return d;
        const f = d.indexOf(c);
        return -1 === f && -1 !== e || -1 === f ? "" : (d = d.substr(0, f), d)
    }
};
var mcProvider = new MCProvider;
mcProvider.run()