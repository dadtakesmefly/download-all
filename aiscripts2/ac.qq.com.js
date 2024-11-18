
function aiparser(){
    var imgList = [];
    var li = {};
    var groupIndex = 0;
    function send(src){
        if (!li[src]) {
            imgList.push({url:src,title:document.title,groupIndex:groupIndex++});
            li[src] = true;
        }
    }
    var nonce, DATA;
    try{
        var scripts = document.querySelectorAll('script');
        for(var i = 0; i < scripts.length; i++){
            if(scripts[i].innerText.match(/^\s*window\[.*?] =.*?;\s*$/)){
                eval(scripts[i].innerText.replace(/.*?=/, 'nonce='));
            }
            if(scripts[i].innerText.match(/var DATA/)){
                eval(scripts[i].innerText);
            }
        }
    }catch(e){
        console.log(e);
    }
    if(nonce && DATA){
        W = window;
        function Base() {
            var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            this.decode = function (c) {
                var a = "",
                    b, d, h, f, g, e = 0;
                for (c = c.replace(/[^A-Za-z0-9\+\/\=]/g, ""); e < c.length;) b = _keyStr.indexOf(c.charAt(e++)), d = _keyStr.indexOf(c.charAt(e++)), f = _keyStr.indexOf(c.charAt(e++)), g = _keyStr.indexOf(c.charAt(e++)), b = b << 2 | d >> 4, d = (d & 15) << 4 | f >> 2, h = (f & 3) << 6 | g, a += String.fromCharCode(b), 64 != f && (a += String.fromCharCode(d)), 64 != g && (a += String.fromCharCode(h));
                return a = _utf8_decode(a)
            };
            _utf8_decode = function (c) {
                for (var a = "", b = 0, d = c1 = c2 = 0; b < c.length;) d = c.charCodeAt(b), 128 > d ? (a += String.fromCharCode(d), b++) : 191 < d && 224 > d ? (c2 = c.charCodeAt(b + 1), a += String.fromCharCode((d & 31) << 6 | c2 & 63), b += 2) : (c2 = c.charCodeAt(b + 1), c3 = c.charCodeAt(b + 2), a += String.fromCharCode((d & 15) << 12 | (c2 & 63) << 6 | c3 & 63), b += 3);
                return a
            }
        }
        var B = new Base(),
            T = DATA.split(''),
            N = nonce,
            len, locate, str;
        N = N.match(/\d+[a-zA-Z]+/g);
        len = N.length;
        while (len--) {
            locate = parseInt(N[len]) & 255;
            str = N[len].replace(/\d+/g, '');
            T.splice(locate, str.length)
        }
        T = T.join('');
        var _v = JSON.parse(B.decode(T));
        if(_v){
            _v.picture.forEach(function(pic, index){
                send(pic.url);
            });
        }else{
            document.querySelectorAll('img').forEach(function(img){
                send(img.src);
            });
        }
    }else{
        document.querySelectorAll('img').forEach(function(img){
            send(img.src);
        });
    }
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}

aiparser();




