var browserName = (GetBrowserNameIndex("Edg") !== -1 ? 'Edge' : GetBrowserNameIndex("YaBrowser") !== -1 ? 'Yandex' : GetBrowserNameIndex("Chrome") !== -1 ? 'Chrome' : 'other');
function GetBrowserNameIndex(r) {
    return navigator.userAgent.indexOf(r)
}
function aiparser() {
    if (top !== self) {
        return;
    }
    var imgList = [];
    function PrefixZero(num, n) {
        return (Array(n).join(0) + num).slice(-n);
    }
    function send(img) {
        if(img.src.match('^//')){
            img.src = location.protocol + img.src;
        }
        imgList.push({...img,url:img.src,title:document.title});
    }
    chrome.runtime.sendMessage({
        tip: 'SET_GROUPS',
        groups: [
            '主图',
            'SKU图片',
            '详情',
        ]
    });
    var script = document.createElement('script');
    script.innerText = `localStorage.dm___moduleData__ = JSON.stringify(window.__moduleData__);`;
    document.body.appendChild(script);
    var __moduleData__ = JSON.parse(localStorage.dm___moduleData__);
    var mainIndex =1;
    try{
        __moduleData__.data.root.fields.skuGalleries['0'].forEach(item=>{
            item.type === 'img' && send({
                src: item.src,
                indexName: '主图_' + PrefixZero(mainIndex++, 2),
                group: '主图',
                groupIndex: 0,
            });
            if (item.type === 'video' && browserName !== 'Chrome') {
                var flag = true;
                document.querySelectorAll('div.dm_video_url').forEach(d=>{
                    if (d.innerText === item.src) flag = false;
                });
                if (flag) {
                    var div = document.createElement('div');
                    div.className = 'dm_video_url';
                    div.innerText = item.src;
                    document.body.appendChild(div);
                    getvideo(item.src);
                }
            }
        })
    }catch(e){

    }
    var colorIndex = 1;
    try{
        __moduleData__.data.root.fields.productOption.skuBase.properties.forEach(p => {
            p.values.forEach(item => {
                item.image && send({
                    src: item.image,
                    group: 'SKU图片',
                    groupIndex: 2,
                    indexName: 'SKU_' + PrefixZero(colorIndex++, 2)
                });
            })
        });
    }catch(e){

    }
    var detailIndex = 1;
    try{
        var descImgs = document.querySelectorAll('.pdp-product-desc img');
        descImgs.forEach(item=>{
            send({
                src: item.src.split(/_\d+/)[0],
                indexName: '详情_'+PrefixZero(detailIndex++, 2),
                group: '详情',
                groupIndex: 3,
            })
        })
    }catch(e){

    }
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
function getvideo(videoUrl) {
    chrome.runtime.sendMessage({tip: 'makeXHRrequest', url: videoUrl, config: {}, responseType: ''}, async (re) => {
        var obj = /<script nonce=".*?">var\s?ytInitialPlayerResponse\s?=\s?(.*?});[\r\n\s]?var/.exec(re);
        if (obj) {
            obj = JSON.parse(obj[1]);
            var streamLists = obj.streamingData.adaptiveFormats;
            var flag = {length: 0};
            var reRow = {
                title: obj.videoDetails.title,
                poster: obj.videoDetails.thumbnail.thumbnails[0].url,
                bytSize: 0,
                size: '',
                url: '',
                def: [],
                videoType: 'mp4',
                isSelect: false,
                fileName: obj.videoDetails.title,
                superSpecialFileName: obj.videoDetails.title
            };
            for (let i = streamLists.length - 1; i > -1; i--) {
                var row = streamLists[i];
                if (row.mimeType.indexOf('audio/mp4')>-1 && !flag.audio) {
                    flag.audio = true;
                    flag.length++;
                    var r = await getFormatRow(row,'audio', 9999999);
                    reRow.def.push(r)
                } else if (row.mimeType.indexOf('video/mp4')>-1 && row.contentLength && !flag[row.height+'P'] && flag.length < 2) {
                    flag[row.height+'P'] = true;
                    flag.length++;
                    var r = await getFormatRow(row,row.height+'P', row.height);
                    reRow.def.push(r)
                }
            }
            for (let i = 0; i < streamLists.length; i++) {
                var row = streamLists[i];
                if (row.mimeType.indexOf('video/mp4')>-1 && row.contentLength && !flag[row.height+'P'] && flag.length < 4) {
                    flag[row.height+'P'] = true;
                    flag.length++;
                    var r = await getFormatRow(row,row.height+'P', row.height);
                    reRow.def.push(r)
                }
            }
            reRow.def = reRow.def.sort((a,b)=>(a.quality-b.quality));
            reRow.url = reRow.def[0].url;
            reRow.size = sizeFormat(reRow.def[0].size);
            reRow.bytSize = reRow.def[0].size;
            chrome.runtime.sendMessage({tip:'addAudioRowFromContent',row:reRow});
        }
    });
}
function getFormatRow(row,desc, i) {
    return new Promise((resolve, reject)=>{
        if (row.url) {
            resolve({
                url:row.url,
                desc: desc,
                useCache: false,
                quality: i,
                size: Number(row.contentLength)
            })
        } else if (row.signatureCipher) {
            var u = row.signatureCipher.replaceAll('%25', '%').replaceAll('%23', '#').replaceAll('%26', '&').replaceAll('%28', '(').replaceAll('%29', ')').replaceAll('%2B', '+').replaceAll('%3A', ':').replaceAll('%3B', ';').replaceAll('%3D', '=').replaceAll('%3F', '?').replaceAll('%40', '@');
            u = u.split("&sp=sig&url=");
            var sig = u[0].substr(2, u[0].length - 3);
            u = u[1] + '&alr=yes' + '&sig=' + 'AOq' + sig.substr(8, 10) + sig.substr(18).replace('A', sig[7]);
            resolve({
                url:u,
                desc: desc,
                useCache: false,
                quality: i,
                size: Number(row.contentLength)
            })
        } else {
            resolve({})
        }
    })
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
aiparser();