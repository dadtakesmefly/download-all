function aiparser() {
    var index = 0;
    function send(img) {
        chrome.runtime.sendMessage({
            tip: 'resGrabberImgRow',
            row: {...img,url:img.src,title:document.title,groupIndex: index++},
        });
    }
    if (location.href.match('yandex.ru/images/search')) {
        var previewImg = document.querySelector('img.MMImage_preview');
        function getIdFromSrc(src){
            var id = src.match(/id=(.*?)($|&)/);
            id = id? id[1] : '';
            return id;
        }
        if(previewImg){
            var selectedItem = document.querySelector('.serp-item[data-bem*="'+previewImg.src+'"]');
            var bem = JSON.parse(selectedItem.dataset.bem);
            var rimDatas = [];
            function getData(tid){
                for(var i = 0; i < rimDatas.length; i++){
                    if(rimDatas[i].tid === tid){
                        return rimDatas[i];
                    }
                }
                return null;
            }
            var rimIndex = -1;
            function getRimData(cb){
                if(rimIndex >= rimDatas.length){
                    cb(null);
                    return;
                }
                if(rimIndex === -1){
                    $.ajax({
                        url: 'https://yandex.ru/images-apphost/rim?docid='+bem['serp-item'].rimId+'&lang=ru',
                        dataType: 'json',
                        success: function(data){
                            rimDatas = rimDatas.concat(data.rld);
                            rimIndex++;
                            cb(data.rld);
                        }
                    })
                }else{
                    $.ajax({
                        url: 'https://yandex.ru/images-apphost/rim?docid='+rimDatas[rimIndex].id+'&lang=ru',
                        dataType: 'json',
                        success: function(data){
                            rimDatas = rimDatas.concat(data.rld);
                            rimIndex++;
                            cb(data.rld);
                        }
                    })
                }
            }
            function processOne(){
                if(imgIndex >= rightImgs.length) return;
                var img = rightImgs[imgIndex];
                tid = getIdFromSrc(img.src);
                if(tid){
                    var data = getData(tid);
                    if(data){
                        if(data.bid){
                            send({
                                src: 'https://im0-tub-ru.yandex.net/i?id='+data.bid+'&n=13&w='+data.btw+'&h='+data.bth
                            });
                        }else{
                            send({
                                src: data.s[data.s.length-1].iu
                            });
                        }
                        imgIndex++;
                        processOne();
                    }else{
                        getRimData(function(data){
                            if(data){
                                processOne();
                            }
                        });
                    }
                }else{
                    send({
                        src: img.src
                    });
                    imgIndex++;
                    processOne();
                }
            }
            var rightImgs = document.querySelectorAll('.MMRelatedImages-Tiles .MMTiledImages-Item img');
            var imgIndex = 0;
            processOne();
        } else {
            var imgSrcs = [];
            document.querySelectorAll('img.serp-item__thumb').forEach(function (img) {
                var serpItem = img.closest('.serp-item');
                var bem = JSON.parse(serpItem.dataset.bem);
                var preview = bem['serp-item'].preview[0];
                imgSrcs.push({
                    src: preview.url,
                    smallUrl: img.src,
                    width: preview.w,
                    height: preview.h,
                });
            });
            for (var i = 0; i < imgSrcs.length; i++) {
                send(imgSrcs[i]);
            }
        }
    } else {
        document.querySelectorAll('img').forEach(function(img){
            send({src:img.src});
        });
    }
}
aiparser();
