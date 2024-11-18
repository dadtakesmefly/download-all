function aiparser() {
    var imgList = [];
    var li = {};
    function send(img){
        if (!li[img.src]) {
            imgList.push({...img,url:img.src,title:document.title + '/' + titleLi[1]});
            li[img.src] = true;
        }
    }
    var titleLi = document.querySelector('.cview_nav_center').innerText.split(/\s?>\s?/);
    if (titleLi.length === 3) {
        var indexNum = 1;
        var indexNum_a = '0000';
        var detailImgs = document.querySelectorAll('.cview_list_even_item img');
        if (detailImgs.length === 0)  detailImgs = document.querySelectorAll('.cview_tm_item img');
        detailImgs.forEach(function (img) {
            send({
                src: img.src,
                indexName: titleLi[2]+'_'+(indexNum_a+indexNum++).substr(-3),
                groupIndex: indexNum,
            })
        });
    }
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();

