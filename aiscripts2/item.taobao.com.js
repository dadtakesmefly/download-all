function aiparser() {
    var imgList = [];
    var li = {};

    function send(img) {
        if(img.src.match('^//')){
            img.src = location.protocol + img.src;
        }
        if (!li[img.src]) {
            imgList.push({...img,url:img.src,title:document.title});
            li[img.src] = true;
        }
    }
    var itemImgs = document.querySelectorAll('#J_UlThumb img');
    var colorImgs = document.querySelectorAll('.J_TSaleProp a');
    var descImgs = document.querySelectorAll('#description img');
    if(location.href.match('h5.m.taobao.com')){
        itemImgs = document.querySelectorAll('.siema-wrapper img');
        descImgs = document.querySelectorAll('.detail-desc img');
    }
    chrome.runtime.sendMessage({
        tip: 'SET_GROUPS',
        groups: [
            '主图',
            'SKU图片',
            '详情',
        ]
    });
    var indexNum = 1;
    function __PrefixZero(num, n) {
        return (Array(n).join('0') + num).slice(-n);
    }
    itemImgs.forEach(function (img) {
        if (!img.src.match(/tbvideo.jpg/)) {
            send({
                src: img.dataset.src || img.src,
                group: '主图',
                indexName: '主图_' + __PrefixZero(indexNum++,3),
                groupIndex: 0,
            })
        }
    });
    indexNum = 1;
    colorImgs.forEach(function (aele) {
        var reg = new RegExp('(//.*)"');
        var url = aele.style.backgroundImage.match(reg);
        if (url) {
            url = location.protocol + url[1];
            send({
                src: url,
                group: 'SKU图片',
                indexName: 'SKU图片_' + __PrefixZero(indexNum++,3),
                groupIndex: 1,
            })
        }
    });
    indexNum = 1;
    descImgs.forEach(function (img) {
        var src = img.dataset.src || img.dataset.ksLazyload || img.src;
        if (!src.match('img-tmdetail.alicdn.com/tps/i3/T1BYd_XwFcXXb9RTPq-90-90.png') &&
            !src.match('spaceball.gif')) {
            send({
                src: src,
                group: '详情',
                indexName: '详情_' + __PrefixZero(indexNum++,3),
                groupIndex: 2,
            })
        }
    });
    var meta = document.querySelector('meta[name="microscope-data"]');
    var scripts = document.querySelectorAll('script');
    var imgVedioID;
    if (meta) {
        var userId = meta.content.match(/userid=(\d+);/);
        if (userId) {
            userId = userId[1];
            for (var i = 0; i < scripts.length; i++) {
                if (scripts[i].innerText) {
                    if (!imgVedioID) {
                        imgVedioID = scripts[i].innerText.match(/"videoId":"(\d+)"/);
                        if (imgVedioID) {
                            imgVedioID = imgVedioID[1];
                            var videoUrl = 'https://cloud.video.taobao.com/play/u/' + userId + '/p/1/e/6/t/1/' + imgVedioID + '.mp4';
                            chrome.runtime.sendMessage({tip: 'addVideoBg', row: {
                                    type: 'video',
                                    url: videoUrl,
                                    fileName: imgVedioID + '.mp4',
                                    bytSize: 0,
                                    videoType: '',
                                    isSelect: false
                                }});
                            break;
                        }
                    }
                }
            }
        }
    }
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});

}
function firstFunc() {
    if (top !== self) return;
    var currentPage;
    var tabId;
    var toPageNo;
    var itemId;
    var sellerId;
    var spuId;
    var jsonpcb;
    function init(){
        itemId = location.href.match('\\bid=(\\d+)')[1];
        sellerId = document.getElementsByName('microscope-data')[0].content.match(/userid=(\d+)/)[1];
        var scripts = document.querySelectorAll('script');
        for(var i = 0; i < scripts.length; i++){
            spuId = scripts[i].innerText.match(/"spuId":"(\d+)"/);
            if(spuId){
                spuId = spuId[1];
                break;
            }
        }
        jsonpcb = `jsonp${parseInt(10000 * Math.random())}`;
        var script = document.createElement('script');
        script.className = 'DM_tbviewlistener';
        console.log(jsonpcb);
        script.innerText = `
        window.${jsonpcb} = function(data){
            window.postMessage({
                topic: 'DM-tbview',
                data: data
            }, '*')
        };
    `;
        document.body.append(script);
        window.addEventListener('message', function (e) {
            if (e.data.topic === 'DM-tbview') {
                processOnePage(e.data.data);
            }
        });
    }
    function processSrc(src){
        if(!src.match(/^http/)){
            src = location.protocol+src;
        }
        return src.split(/_\d+x\d+/)[0];
    }
    function processOnePage(data){
        if(data.comments){
            var pageNo = data.currentPageNum;
            data.comments.forEach((item, rateIndex) => {
                var rowGroup = {title:`第${pageNo}页-第${rateIndex+1}条评论`,selected:true,rows:[],index:(pageNo-1)*20+rateIndex};
                resData(rowGroup,item,rateIndex,pageNo,1);
                chrome.runtime.sendMessage({tip:'resContentRows',rows:rowGroup,tabId:tabId});
            })
        }else{

        }
        if(currentPage < toPageNo){
            currentPage++;
            setTimeout(()=>{getOnePage(currentPage);},2000)
        }
    }
    function resData(rowGroup,item,rateIndex,pageNo,iii) {
        var videoList = [];
        if(item.video){
            videoList.push(item.video);
        }
        videoList.forEach((v, vindex) => {
            var row = {
                type: 'video',
                src: processSrc(v.cloudVideoUrl),
                originalUrl: processSrc(v.cloudVideoUrl),
                title: document.title,
                selected: true,
                poster: processSrc(v.coverUrl),
                indexName: `第${pageNo}页-第${rateIndex+1}条评论-${iii++}`,
                group: `第${pageNo}页-第${rateIndex+1}条评论`,
                groupIndex: (pageNo-1)*100+rateIndex*5+iii
            };
            rowGroup.rows.push(row);
        });
        item.photos.forEach((pic) => {
            var row = {
                type: 'img',
                src: processSrc(pic.url),
                originalUrl: processSrc(pic.url),
                title: document.title,
                selected: true,
                indexName: `第${pageNo}页-第${rateIndex+1}条评论-${iii++}`,
                group: `第${pageNo}页-第${rateIndex+1}条评论`,
                groupIndex: (pageNo-1)*100+rateIndex*5+iii
            };
            rowGroup.rows.push(row);
        });
        if (item.append) {
            resData(rowGroup,item.append,rateIndex,pageNo,iii)
        }
    }
    function getOnePage(pageno){
        if(document.querySelectorAll('.DM_tbviewlistener').length === 0){
            init();
        }
        var script1 = document.createElement('script');
        var _ksTS = `${Date.now()}_${parseInt(10000*(Math.max(0.1, Math.random())))}`;
        var ua = Math.random();
        script1.src = `https://rate.taobao.com/feedRateList.htm?auctionNumId=${itemId}&userNumId=${sellerId}&currentPageNum=${pageno}&pageSize=20&rateType=3&orderType=sort_weight&attribute=&sku=&hasSku=true&folded=0&ua=${ua}&_ksTS=${_ksTS}&callback=${jsonpcb}`;
        document.body.appendChild(script1);
    }
    var intervalCount = 0;
    var interval = setInterval(function () {
        if (intervalCount > 20) {
            clearInterval(interval);
        }
        intervalCount++;
        if (document.querySelectorAll('a[shortcut-label="查看累计评论"]').length > 0) {
            chrome.runtime.sendMessage({tip: 'resHaveComment'});
            chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
                if (request.tip === 'start') {
                    tabId = request.tabId;
                    currentPage = request.currentPage;
                    toPageNo = request.toPageNo;
                    getOnePage(currentPage);
                }
            });
            clearInterval(interval);
        }
    },500)
}
firstFunc();
aiparser();
