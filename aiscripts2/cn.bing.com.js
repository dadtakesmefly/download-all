function aiparser(){
    var imgList = [];
    var li = {};
    var groupIndex = 0;

    function send(img) {
        if (!li[img.src]) {
            imgList.push({...img, url: img.src, title: document.title,groupIndex:groupIndex++});
            li[img.src] = true;
        }
    }
    document.querySelectorAll('.imgpt').forEach(function(item){
        try{
            var m= JSON.parse(item.querySelector('.iusc').getAttribute('m'));
            send({
                src: m.murl,
            });
        }catch(e){
            console.log(e)
        }
    });
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();


