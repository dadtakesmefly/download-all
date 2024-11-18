plus.storage.setItem('imgs', '');
plus.storage.setItem('videos', '');
var groupIndex = 0;
function aiparser(tabInfo){
    var imgList = [];
    var li = {};

    function send(src) {
        if (!li[src]) {
            imgList.push({url:src,title:document.title,groupIndex: groupIndex++});
            li[src] = true;
        }
    }
    document.querySelectorAll('.m-auto-list img, .focusImg img').forEach(function(img){
        send(img.src);
    });
    if (imgList.length > 0) {
        var liststr = JSON.stringify(imgList);
        liststr = liststr.replace(/(^\[|\]$)/g, '') + ',';
        plus.storage.setItem('imgs', (plus.storage.getItem('imgs') || '') + liststr);
    }
}
aiparser();

