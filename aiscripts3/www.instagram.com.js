
function aiparser(){
    var imgList = [];
    var li = {};

    function send(img) {
        if (!li[img.src]) {
            imgList.push({...img,url:img.src,title:document.title});
            li[img.src] = true;
        }
    }
    document.querySelectorAll('img').forEach(function(img){
        var src = img.src;
        if(img.srcset){
            src = img.srcset.split(',').pop().split(' ')[0];
            var link = img.closest('a');
            if(link){
                 !aiparser_imgs[link.href] && (aiparser_imgs[link.href] =  src);
            }else{
                send({
                    src: src,
                })
            }
        }else{
            send({
                src: src,
            })
        }
    });
    for(var url in aiparser_imgs){
        if(url.match('instagram.com')){
            (function(index2){
                fetch(url).then(function(res){
                    return res.text();
                }).then(function(text){
                    var result = text.match('"display_url":"(.*?)"');
                    var src;
                    if(result){
                        eval(`src="${result[1]}"`);
                    }
                    send({
                        src: src,
                    }, index2)
                })
            })();
        }else{
            send({
                src: aiparser_imgs[url],
            })
        }
    }
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
var aiparser_imgs = {};
(function(){
    var targetNode = document.querySelector('main');
    var options = { attributes: false, childList: true,subtree:true,attributeOldValue:false};
    function callback(mutationsList, observer) {
        mutationsList.forEach(function(record){
            record.removedNodes.forEach(function(node){
                node.querySelectorAll('img').forEach(function(img){
                    var link = img.closest('a');
                    if(link && !aiparser_imgs[link.href]){
                        aiparser_imgs[link.href] = img.srcset? img.srcset.split(',').pop().split(' ')[0] : img.src;
                    }
                })
            })
        })
    }
    var mutationObserver = new MutationObserver(callback);
    mutationObserver.observe(targetNode, options);
})();

aiparser();
