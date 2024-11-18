
function aiparser() {
    var script = document.createElement('script');
    script.innerText = 'localStorage.dm_lemmaId = window.lemmaId;';
    document.body.appendChild(script);
    var dm_lemmaId = localStorage.dm_lemmaId;
    var pn = 1;
    if (dm_lemmaId) getData();
    function getData() {
        chrome.runtime.sendMessage({
            tip: 'makeXHRrequest',
            url: 'https://baike.baidu.com/api/wikisecond/lemmavideo?lemmaId='+dm_lemmaId+'&pn='+pn+'&isSensitive=0&dataSource=related',
            config: {},
            responseType: ''
        }, (re) => {
            re = JSON.parse(re);
            re.list.forEach(r=>{
                chrome.runtime.sendMessage({tip:'addVideoBg',row:{
                        type: 'video',
                        url: r.playMp4Url,
                        poster: r.coverPic.imageUrl,
                        fileName: r.title,
                        title: document.title,
                        superSpecialFileName: r.title,
                        bytSize: 0,
                        videoType: 'MP4',
                        isSelect: false
                    }})
            });
            if (re.list.length>0) {
                pn++;
                getData();
            }
        });
    }
}

aiparser();