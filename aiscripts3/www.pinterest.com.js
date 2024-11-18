function aiparser(tabInfo){
    var imgList = [];
    var li = {};

    function send(img) {
        if (!li[img.src]) {
            imgList.push({...img, url: img.src, title: document.title});
            li[img.src] = true;
        }
    }
    var imgs = document.querySelectorAll('div[role="img"]');
    if (imgs.length === 0) {
        imgs = document.querySelectorAll('div[data-test-id="pinWrapper"] img');
        imgs.forEach(row => {
            if (row.src) send({src: row.src.replace(/236x/,'originals')})
        })
    } else {
        imgs.forEach(row => {
            try {
                if (row.style.backgroundImage.split('"')[1]) send({src:row.style.backgroundImage.split('"')[1]})
            } catch (e) {
            }
        });
    }
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();
