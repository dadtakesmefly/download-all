function aiparser(tabInfo){
    var imgList = [];
    var li = {};

    function send(src) {
        if(src.match('^//')){
            src = location.protocol + src;
        }
        if (!li[src]) {
            imgList.push({url:src,title:document.title});
            li[src] = true;
        }
    }
    var pages = document.querySelector('#page_select').options;
    for(var i = 0; i < pages.length; i++){
        send(pages[i].value);
    }
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();
