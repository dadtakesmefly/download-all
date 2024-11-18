function aiparser() {
    var imgList = [];
    var li = {};

    function send(img) {
        if (!li[img.src]) {
            imgList.push({...img,url:img.src,title:document.title});
            li[img.src] = true;
        }
    }
    var imgs = document.querySelectorAll('.product-intro__thumbs-item img');
    if (imgs.length === 0) {
        imgs = document.querySelectorAll('img');
    }
    imgs.forEach(img=>{
        send({src: (img.dataset.lazeSrc || img.src).replace(/_thumbnail_\d+x\d+/, '').replace('.webp', '.jpg')})
    });
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();

