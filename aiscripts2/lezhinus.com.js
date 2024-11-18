function aiparser() {
    if (self != top) {
        return;
    }
    function __PrefixZero(num, n) {
        return (Array(n).join('0') + num).slice(-n);
    }
    var groupIndex = 1;
    var script = document.createElement('script');
    script.innerText = 'localStorage.__dmlzdata = JSON.stringify(window.__LZ_DATA__);\n';
    document.body.appendChild(script);
    var __dmlzdata = JSON.parse(localStorage.__dmlzdata);
    if (__dmlzdata) {
        __dmlzdata.episode.scrollsInfo.forEach(d=>{
            chrome.runtime.sendMessage({
                tip: 'resGrabberImgRow',
                row: {
                    url: 'https://cdn.lezhin.com/v2' + d.path,
                    title: __dmlzdata.alias + '-' + __dmlzdata.episode.name,
                    indexName: __PrefixZero(groupIndex,3),
                    groupIndex: groupIndex++
                }
            });
        })
    }

}

aiparser();
