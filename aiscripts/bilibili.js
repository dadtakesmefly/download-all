var li_cid = {};
var defs = {
    120: "4K",
    116: "1080P+",
    112: "1080P+",
    80: "1080P",
    74: "720P+",
    64: "720P",
    48: "720P",
    32: "480P",
    16: "360P",
    6: "240P",
};
let dlCacheItemObj = {}; //缓存下载文件对象
let hrefed = '';

chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.tip === 'downloadCacheRow') {
            chrome.runtime.sendMessage({
                tip:'dlSuperSpecialFileName',
                superSpecialFileName:request.superSpecialFileName,
                title:request.title,
                url:request.url,
            },()=>{
                dlCacheItemObj[request.url].getElementsByTagName('a')[0].click();
            });
        }
    });
function videoRequest() {
    var dmid = 'dm_zcbuandjfhzhusaunbcuhasdnnzhu';
    var div = document.getElementById(dmid);
    if (div) {
    } else {
        div = document.createElement('div');
        div.style.display="none";
        div.id=dmid;
        document.body.appendChild(div);
        div.setAttribute('onclick',  "if(window.__INITIAL_STATE__){if(window.__INITIAL_STATE__.videoData){document.getElementById('"+dmid+"').innerText=JSON.stringify(window.__INITIAL_STATE__.videoData)}}");
    }
    div.click();
    if (!document.getElementById(dmid).innerText) return;
    var acid = JSON.parse(document.getElementById(dmid).innerText);
    var aid = acid.aid + '';
    var cid = acid.cid + '';
    var support_formats = [];
    var qns = [];
    if (!li_cid[cid]) {
        li_cid[cid] = true;
        if (aid) {
            var url = 'https://api.bilibili.com/x/web-interface/view?aid=' + aid;
            chrome.runtime.sendMessage({tip:'makeXHRrequest',url:url,config:{},responseType:''},(re)=>{
                var title;
                var res = JSON.parse(re);
                if (res.data.pages.length === 1) {
                    title = res.data.title;
                }
                var page = res.data.pages.find(item=>(item.cid.toString() === cid));
                chrome.runtime.sendMessage({tip:'makeXHRrequest',url:'https://api.bilibili.com/x/player/playurl?avid='+aid+'&cid='+page.cid+'&qn=80&platform=html5',config:{},responseType:''},(re)=>{
                    var ress = JSON.parse(re);
                    var videoUrl = ress.data.durl[0].url;
                    var row = {
                        title: res.data.title,
                        poster:res.data.pic,
                        bytSize:ress.data.durl[0].size,
                        size: sizeFormat(ress.data.durl[0].size),
                        url: videoUrl,
                        videoType: 'mp4',
                        isSelect: false
                    };
                    if (title) {
                        row.fileName = title;
                        row.superSpecialFileName = title;
                    } else {
                        row.fileName = page.part;
                        row.superSpecialFileName = page.part;
                    }
                    chrome.runtime.sendMessage({tip:'makeXHRrequest',url:'https://api.bilibili.com/x/player/playurl?avid='+aid+'&cid='+page.cid+'&qn=120',config:{},responseType:''},(re)=> {
                        var ressHD = JSON.parse(re);
                        if (ressHD.data.quality > 16) {
                            var urlHD = ressHD.data.durl[0].url;
                            dlCacheItemObj[urlHD] = document.createElement('div');
                            dlCacheItemObj[urlHD].innerHTML = "<a href='"+urlHD+"' download target='DMdl'></a><iframe name='DMdl'></iframe>>";
                            document.body.appendChild(dlCacheItemObj[urlHD]);
                            var qn = defs[ress.data.quality].split('P')[0];
                            var qnHD = defs[ressHD.data.quality].split('P')[0];
                            row.def = [
                                {
                                    url:row.url,
                                    desc: defs[ress.data.quality],
                                    useCache: false,
                                    quality: ress.data.quality,
                                    type: 'mp4',
                                    size: ressHD.data.durl[0].size,
                                },
                                {
                                    url:ressHD.data.durl[0].url,
                                    desc: defs[ressHD.data.quality],
                                    useCache: true,
                                    quality: ressHD.data.quality,
                                    type: 'flv',
                                    size: ressHD.data.durl[0].size,
                                }
                            ];
                            ressHD.data.support_formats.forEach(f=>{
                                if (f.display_desc.indexOf(qnHD)<0&&f.display_desc.indexOf(qn)<0) {
                                    support_formats.push(f)
                                }
                            });
                            ['480', '720'].forEach(p=>{
                                for (let i = support_formats.length - 1; i>-1;i--) {
                                    if (ressHD.data.quality > support_formats[i].quality && ress.data.quality < support_formats[i].quality && support_formats[i].display_desc.indexOf(p)>-1) {
                                        qns.push(support_formats[i].quality);
                                        break;
                                    }
                                }
                            });
                            if (qns.length === 0) chrome.runtime.sendMessage({tip:'addAudioRowFromContent',row:row});
                            var qnIndex = 0;
                            for (let i = qns.length - 1; i>-1;i--) {
                                chrome.runtime.sendMessage({tip:'makeXHRrequest',url:'https://api.bilibili.com/x/player/playurl?avid='+aid+'&cid='+page.cid+'&qn='+qns[i],config:{},responseType:''},(response)=> {
                                    var ressHDs = JSON.parse(response);
                                    var urlHDs = ressHDs.data.durl[0].url;
                                    dlCacheItemObj[urlHDs] = document.createElement('div');
                                    dlCacheItemObj[urlHDs].innerHTML = "<a href='"+urlHDs+"' download target='DMdl'></a><iframe name='DMdl'></iframe>>";
                                    document.body.appendChild(dlCacheItemObj[urlHDs]);
                                    row.def.push({
                                        url:ressHDs.data.durl[0].url,
                                        desc: defs[ressHDs.data.quality],
                                        quality: ressHDs.data.quality,
                                        useCache: true,
                                        type: 'flv',
                                        size: ressHDs.data.durl[0].size,
                                    });
                                    qnIndex++;
                                    if (qns.length === qnIndex) {row.def = row.def.sort((a,b)=>(a.quality-b.quality));chrome.runtime.sendMessage({tip:'addAudioRowFromContent',row:row})}
                                })
                            }
                        } else chrome.runtime.sendMessage({tip:'addAudioRowFromContent',row:row})
                    })
                })
            });
        } else {
        }
    }
}
function sizeFormat (size) {
    if (!(size > 0)) return '0B';

    let unit = 'B';

    if (size > 1024) {
        unit = 'KB';
        size /= 1024;
    }

    if (size > 1024) {
        unit = 'MB';
        size /= 1024;
    }

    if (size > 1024) {
        unit = 'GB';
        size /= 1024;
    }

    if (size > 1024) {
        unit = 'TB';
        size /= 1024;
    }

    if (size > 1024) {
        unit = 'PB';
        size /= 1024;
    }

    if (size > 1024) {
        unit = 'EB';
        size /= 1024;
    }
    return size.toFixed(2) + unit;
}
setInterval(()=>{
    if (hrefed !== window.location.href) {
        hrefed = window.location.href;
        videoRequest()
    }
},1000);

