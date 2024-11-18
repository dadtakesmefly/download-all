
function aiparser(tabInfo){
    var imgList = [];
    var li = {};

    function send(img) {
        if (!li[img.src]) {
            imgList.push({...img,url:img.src,title:document.title});
            li[img.src] = true;
        }
    }
    var docTitle = '';
    var beizhu = document.querySelector('.remark-row span');
    if(beizhu){
        docTitle = beizhu.textContent;
    }
    if(!docTitle){
        try{
            var name = document.querySelector('.base-info-top .name').textContent;
            docTitle = name;
        }catch(e){

        }
    }
    docTitle = docTitle.replace(/\s/g, '');
    var imgs = document.querySelectorAll('.msg-list .buyer-item .msg-content img');
    imgs.forEach(function(img){
        if(img.src.match(/\/chat\/chat_user_upload|chat-img.pddugc.com/)){
            send({
                src: img.src,
                docTitle: docTitle,
            })
        }
    });
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();
