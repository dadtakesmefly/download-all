var FBProvider = class{
    constructor() {
        this.user_id = $("script:contains(\"async_get_token\")").text().split("USER_ID\":\"").pop().split("\"")[0];
        this.INIT_CLASS = "dm_zcbuandjfhzhusaunbcuhasdnnzhu";
        this.check_dup = {};
    }

    run() {
        this.search();
    }
    search() {
        window.location.href !== this.location && (this.videos = [], $("*").removeClass(this.INIT_CLASS), this.location = window.location.href), $("a[href*=\"/videos/\"]").not("." + this.INIT_CLASS).each((a, b) => {
            var c = $(b);
            c.addClass(this.INIT_CLASS);
            var d = c.attr("href"), e = this.GetVideoIdFromURL(d);
            "number" == typeof e && "string" == typeof d && this.GetVideosFromURL(d, e).catch(() => {
                this.getVideoFromPost(e)
            })
        })
    }

    GetVideoIdFromURL(a) {
        var b = null;
        try {
            var c = this.parseURL(a), d = c.query, e = c.path, f = this.ParseQuery(d);
            if (0 <= e.indexOf("ajax/sharer")) b = f.id; else if (0 <= e.indexOf("/videos/")) {
                var g = e.split("/").filter(a => 0 < a.length);
                b = g[g.length - 1]
            } else 0 <= e.indexOf("/watch/") ? b = f.v : 0 <= e.indexOf("permalink.php") && (b = f.story_fbid);
            if (!b) throw new Error("Id not found");
            b = parseInt(b)
        } catch (a) {
            return null
        }
        return b
    }
    getVideoFromPost(a) {
        this.Fetch(`https://m.facebook.com/story.php?story_fbid=${a}&id=${this.user_id}`, !1).then(b => {
            let c = this.findOnceMatch(b, /video&quot;,&quot;src&quot;:\s*&quot;([^\"]+)&quot;/);
            if (c) {
                const d = c[0].replaceAll("\\", "").replaceAll("&amp;", "&").split("&quot;")[0],
                    e = $("<div />", {html: b.split("<strong>")[1].split("</strong>")[0] + " - " + b.split("<abbr>")[1].split("</abbr>")[0]}).text();
                chrome.runtime.sendMessage({tip:'addAudioRowFromContent',row:{
                        type: 'video',
                        url: d,
                        fileName: e,
                        title: document.title,
                        superSpecialFileName: e,
                        bytSize: 0,
                        videoType: 'MP4',
                        isSelect: false
                    }})
            }
        })
    }
    GetVideosFromURL(a, b) {
        return null === b ? console.log(new Error("Wrong video id")) : (a = "https://www.facebook.com/video.php?v=" + b, a = "https://www.facebook.com/plugins/video.php?" + $.param({href: a}), this.Fetch(a, !1).then(c => {
            var d = $("<output>").append(c);
            var v240 = this.findMatch(c, /\"sd_src_no_ratelimit\":\s*\"([^\"]+)\"/gi, "sd_src_no_ratelimit");
            var v720 = this.findMatch(c, /\"hd_src_no_ratelimit\":\s*\"([^\"]+)\"/gi, "hd_src_no_ratelimit");
            if (!this.check_dup[v720[0] || v240[0]]) {
                this.check_dup[v720[0] || v240[0]] = true;
                chrome.runtime.sendMessage({tip:'addAudioRowFromContent',row:{
                        type: 'video',
                        url: v720[0] || v240[0],
                        title: document.title,
                        fileName: d.find("a[id^='u_0_c']").text(),
                        superSpecialFileName: d.find("a[id^='u_0_c']").text(),
                        bytSize: 0,
                        videoType: 'MP4',
                        isSelect: false
                    }})
            }
        }))
    }

    findOnceMatch(a, b) {
        var c = a.match(b);
        return c ? [c[1]] : []
    }

    findMatch(a, b, c) {
        var d = a.match(b);
        return d ? d.filter(function (a, b, c) {
            return c.indexOf(a) === b && a
        }).map(a => {
            var b = JSON.parse("{" + a + "}");
            return b[c]
        }) : []
    }

    pushVideo(a) {
        // this.ids[a.vid] || (this.ids[a.vid] = !0, this.videos = this.videos.concat(a), 0 < a.variants.length && (this.updateVideos(a), this.setBadge()))
        console.log(a,'videoA')
    }

    parseURL(a) {
        for (var b = {
            strictMode: !1,
            key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
            q: {name: "queryKey", parser: /(?:^|&)([^&=]*)=?([^&]*)/g},
            parser: {
                strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
            }
        }, c = b.parser[b.strictMode ? "strict" : "loose"].exec(a), d = {}, e = 14; e--;) d[b.key[e]] = c[e] || "";
        var f = {};
        "" !== d.protocol && (f.scheme = d.protocol), "" !== d.host && (f.host = d.host), "" !== d.port && (f.port = d.port), "" !== d.user && (f.user = d.user), "" !== d.password && (f.pass = d.password), "" !== d.path && (f.path = d.path), "" !== d.query && (f.query = d.query), "" !== d.anchor && (f.fragment = d.anchor);
        return  f
    }

    Fetch(a, b) {
        // return void 0 === b && (b = !0),
        var _this = this;
        return void 0 === b && (b = !0), new Promise(function (c) {
            _this.bgAjaxRequest(a,{},'text').then((a)=>{
                c(b ? JSON.parse(a) : a);
            });
            /*chrome.runtime.sendMessage({action: "makeXHRrequest", url: a, config: {}, responseType: "text"}, a => {
                c(b ? JSON.parse(a) : a)
            })*/
        })
    }
    bgAjaxRequest(a, b = {}, c = "json") {
        return new Promise(d => {
            fetch(a, b).then(a => "json" === c ? a.json() : a.text()).then(a => {
                d(a)
            })
        })
    }

    ParseQuery(a) {
        var b = {}, c = (a.split("?")[1] || "").split("&");
        for (var d in c) if (c.hasOwnProperty(d)) {
            var e = c[d].split("=");
            b[e[0]] = decodeURIComponent(e[1] || "")
        }
        return b
    }
};
var dmFBProvider = new FBProvider;
setInterval(()=>{dmFBProvider.run()},1000);
