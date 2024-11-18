function aiparser(tabInfo){
    document.body.querySelectorAll('.image-list canvas').forEach(function(canvas){
        chrome.runtime.sendMessage({tip:'resGrabberImgRow',row:{url: canvas.toDataURL('image/jpeg', 1.0), title: document.title}});
    });
}
aiparser();

