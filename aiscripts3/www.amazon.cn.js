
function aiparser(){
    var imgList = [];
    var li = {};

    function send(img) {
        if (!li[img.src]) {
            imgList.push({...img, url: img.src, title: document.title});
            li[img.src] = true;
        }
    }
    var script = document.querySelector('#imageBlockVariations_feature_div>script');
    var imgs = [];
    var skuImgs = [];
    chrome.runtime.sendMessage({
        tip: 'SET_GROUPS',
        groups: [
            '主图',
            'SKU图片',
            '详情',
        ]
    });
    var indexNum = 1;
    var skuIndexNum = 1;
    function __PrefixZero(num, n) {
        return (Array(n).join('0') + num).slice(-n);
    }
    if(script){
        try{
            var obj= JSON.parse(script.innerText.match(/jQuery.parseJSON\('(.*?)'\)/)[1]);
            for(var key in obj.colorImages){
                imgs = imgs.concat(obj.colorImages[key].map(function(image, index){
                    if(index === 0){
                        skuImgs.push({
                            src: image.hiRes || image.large,
                            group: 'SKU图片',
                            indexName: 'SKU图片_' + __PrefixZero(skuIndexNum++,3),
                            groupIndex: 1,
                        })
                    }
                    return {
                        src: image.hiRes || image.large,
                        group: '主图',
                        indexName: '主图_' + __PrefixZero(indexNum++,3),
                        groupIndex: 0,
                    }
                }));
            }
        }catch(e){

        }
    }
    indexNum = 1;
    if(imgs.length > 0){
        skuImgs.forEach(function(img){
            send(img);
        });
        imgs.forEach(function(img){
            send(img);
        });
        var descImgs = document.querySelectorAll('#aplus img');
        for(var i = 0; i < descImgs.length; i++){
            send({
                src: descImgs[i].dataset.src || descImgs[i].src,
                group: '详情',
                indexName: '详情_' + __PrefixZero(indexNum++,3),
                groupIndex: 2,
            })
        }
    }else{
        var scripts = document.querySelectorAll('script');
        for(var i = 0; i < scripts.length; i++){
            var matchrst = scripts[i].innerText.match(/var data = {[\s\S]*'colorImages'[\s\S]*?};/);
            var colorImages = [];
            if(matchrst){
                try{
                    eval(matchrst[ 0 ]);
                    colorImages = data.colorImages.initial;
                    colorImages.forEach(function(image){
                        imgs.push({
                            src: image.hiRes || image.large
                        });
                    })
                }catch(e){
                    matchrst = matchrst[0].match('initial.*?(\\[.*}\\])},');
                    colorImages=JSON.parse(matchrst[1]);
                    colorImages.forEach(function(image){
                        imgs.push({
                            src: image.hiRes || image.large
                        });
                    })
                }
                break;
            }
        }
        if(imgs.length > 0){
            imgs.forEach(function(img, index){
                send(img);
            })
        }else{
            imgs = document.querySelectorAll('#altImages img');
            if(imgs.length === 0){
                imgs = document.querySelectorAll('img');
            }
            imgs.forEach(function(img){
                send({
                    src: img.src
                });
            });
        }
    }
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}
aiparser();
