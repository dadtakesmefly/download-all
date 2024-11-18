
function aiparser() {
    var dmid = 'dm_zcbuanasdijgnhsahklzmmhfsausu';
    var div = document.getElementById(dmid);
    if (div) {
    } else {
        div = document.createElement('div');
        div.style.display="none";
        div.id=dmid;
        document.body.appendChild(div);
        div.setAttribute('onclick',  "document.getElementById('"+dmid+"').innerText=JSON.stringify(pageInfo)");
    }
    div.click();
    var res = document.getElementById(dmid).innerText;
    if (res) {
        const tit = res.title;
        const m3u8 = JSON.parse(JSON.parse(res).currentVideoInfo.ksPlayJson).adaptationSet[0].representation[0].url;
        const reg = new RegExp('https:\\/\\/.*\\.acfun\\.cn\\/.*\\/segment\\/|http:\\/\\/.*\\.acfun\\.cn\\/.*\\/segment\\/');
        const reg_new = new RegExp('https:\\/\\/.*\\.acfun\\.cn\\/.*\\/hls\\/|http:\\/\\/.*\\.acfun\\.cn\\/.*\\/hls\\/');
        let prefix = "";
        if (reg.test(m3u8)) {
            prefix = m3u8.match(reg)[0];
        }else if(reg_new.test(m3u8)){
            prefix = m3u8.match(reg_new)[0];
        }
        var xhr = new XMLHttpRequest();
        xhr.open('get',m3u8,true);
        xhr.timeout = 10e3;
        let index = 1;
        xhr.onload = ()=>{
            const data = xhr.response;
            let tamp = data.match(/#.*?\n(.*?)\n/g);
            let tmp = [];
            for (let i = 0; i < tamp.length; i++) {
                const e = tamp[i];
                if (e.indexOf(".ts") !== -1) {
                    tmp.push({
                        url: prefix + e.replace(/#.*?\n/, "").replace(/\n$/, ""),
                        type: 'video',
                        bytSize: 0,
                        fileName: tit,
                        videoType: 'ts',
                        superSpecialFileName: 'true',
                        isSelect: false,
                        poster: 'poster',
                        videoIndex: index++
                    })
                }
            }
            chrome.runtime.sendMessage({tip:'addContentVideoRows',lists:tmp})
            // console.log(tmp)
        };
        xhr.send();
    }
}

aiparser();