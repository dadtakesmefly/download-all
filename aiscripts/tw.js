var TWProvider = class {
    constructor() {
        this.oauth2_access_token = "AAAAAAAAAAAAAAAAAAAAAPYXBAAAAAAACLXUNDekMxqa8h%2F40K4moUkGsoc%3DTYfbDKbT3jJPCEVnMYqilB28NHfOPqkca3qaAxGfsyKCs0wRbw"
        this.INIT_CLASS = "dm_zcbuandjfhzhusaunbcuhasdnnzhu";
        this.ids = {};
        this.OAUTH2_TOKEN_API_URL = "https://api.twitter.com/oauth2/token";
        this.ENCODED_TOKEN_CREDENTIAL = "UEtLaXU5SWpFRVNIVFJVc3Jqbkh1YzBDbDpzb1lMMWZOa3BDTmxLcDVNR0g1QkpGd09KODQwekliWGVWMHc4enFhUXBRTE4yRTJZSA==";
    }

    getCredentialToken(a) {
        const b = new XMLHttpRequest;
        b.open("GET", TW_CREDENTIAL_TOKEN_URL, !0), b.onload = () => {
            200 === b.status && (this.ENCODED_TOKEN_CREDENTIAL = b.responseText), a()
        }, b.send()
    }

    getAccessToken(a) {
        const b = this;
        $.ajax({
            type: "POST",
            url: this.OAUTH2_TOKEN_API_URL,
            headers: {
                Authorization: "Basic " + this.ENCODED_TOKEN_CREDENTIAL,
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                "x-csrf-token": this.getCookie("ct0")
            },
            data: {grant_type: "client_credentials"},
            dataType: "json",
            xhrFields: {withCredentials: !1},
            success: c => {
                b.oauth2_access_token = c.access_token, a && a()
            }
        })
    }

    search() {
        this.oauth2_access_token && $("video").not("." + this.INIT_CLASS).each((a, b) => {
            const c = $(b), d = c.closest("article"), e = this.getTweetId(d), f = c.parent();
            e && !this.ids[e] && this.getVideoData(e), c.addClass(this.INIT_CLASS)
        })
    }

    getTweetId(a) {
        return this.getTweetData(a, /(?:https:\/\/[A-z.]*\/\w*\/status\/)(\d*)(?:\/?\w*)/g)
    }

    getTweetData(a, b) {
        for (const c of a.find("a").toArray()) {
            const a = b.exec(c.href);
            if (a) return a[1]
        }
    }

    bgAjaxRequest(a, b = {}, c = "json") {
        return new Promise(d => {
            fetch(a, b).then(a => "json" === c ? a.json() : a.text()).then(a => {
                d(a)
            })
        })
    }
    getCookie(a) {
        var b = "; " + document.cookie, c = b.split("; " + a + "=");
        if (2 === c.length) return c.pop().split(";").shift()
    }
    getVideoData(a) {
        const cc = {
            headers: {
                Authorization: "Bearer " + this.oauth2_access_token,
                "x-csrf-token": this.getCookie("ct0")
            }
        };
        var aa = `https://api.twitter.com/1.1/statuses/show.json?id=${a}&include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_ext_alt_text=true&include_reply_count=1&tweet_mode=extended&trim_user=false&include_ext_media_color=true`;
        chrome.runtime.sendMessage({
            tip: "makeXHRrequest",
            url: aa,
            config: cc
        }, c => {
            const d = c.full_text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "");
            let e = '0';
            let url = '';
            c.extended_entities && c.extended_entities.media[0].video_info.variants.filter(a => "video/mp4" === a.content_type).forEach(a => {
                const b = a.url, c = b.match(/vid\/(.+)\//), d = c && c[1] ? c[1].replace(/^.+x/, "") : "";
                if (d>e) {url = b} else {e = d}
            });
            var row = {
                type: 'video',
                url: url,
                title: document.title,
                fileName: d,
                superSpecialFileName: d,
                bytSize: 0,
                videoType: 'MP4',
                isSelect: false
            };
            if (url) chrome.runtime.sendMessage({tip:'addVideoBg',row:row})
        })
    }
};

var dmTWProvider = new TWProvider;
setInterval(()=>{dmTWProvider.search()},1000);