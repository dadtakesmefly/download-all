function aiparser(){
    document.querySelectorAll('img').forEach(function(img){
        chrome.runtime.sendMessage({tip:'resGrabberImgRow',row:{url: img.src, title: document.title}});
    });
}
aiparser();
