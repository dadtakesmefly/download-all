
function aiparser(tabInfo){
    var imgList = [];
    var li = {};

    function send(src) {
        if (!li[src]) {
            imgList.push({url:src.replace('http:', location.protocol).replace('/640?', '/0?'),title:document.title});
            li[src] = true;
        }
    }
    if(location.href.match('mp.weixin.qq.com/s')){
        var imgs = document.body.innerHTML.match(/data-src="https?:\/\/mmbiz.qpic.cn\/.*?("|&quot)/g) || [];
        imgs.forEach(function(img){
            send(img.replace('data-src="', '').replace(/("|&quot)$/, ''));
        });
        if(imgs.length === 0){
            document.querySelectorAll('img').forEach(function(img){
                send(img.src.replace('http:', location.protocol));
            });
        }
    }else{
        document.querySelectorAll('img').forEach(function(img){
            send(img.src);
        });
    }
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();
