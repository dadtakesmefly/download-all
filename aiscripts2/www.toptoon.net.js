
function aiparser() {
    var imgList = [];
    var li = {};
    var index = 0;
    function send(img,index) {
        if (!li[img.src]) {const xhr = new XMLHttpRequest();
            xhr.open('get', img.src, true);
            xhr.responseType = 'blob';
            xhr.onload = () => {
                blobToDataURL(xhr.response, (url) => {
                    url = url.replace(/.*?;/,'data:image/jpeg;');
                    chrome.runtime.sendMessage({
                        tip:'resGrabberImgRow',
                        row:{url: url, title: document.title, groupIndex: index}
                    });
                })
            };
            xhr.send();
            li[img.src] = true;
        }
    }
    if (location.href.match(/episode_view|epView/)) {
        imgs2 = document.querySelectorAll('#viewer_body img, .epContent img');
        var imgs3 = [];
        var currentIndex = '';
        imgs2.forEach(img => {
            if (img.id) {
                var index = img.id.split('_')[1];
                if (currentIndex !== index) {
                    imgs3.push([img]);
                    currentIndex = index;
                } else {
                    imgs3[imgs3.length - 1].push(img);
                }
            } else {
                imgs3.push([img])
            }
        });
        var invert = function (pixels) {

            var d = pixels.data;

            for (var i = 0; i < d.length; i += 4) {
                d[i] = 255 - d[i];
                d[i + 1] = 255 - d[i + 1];
                d[i + 2] = 255 - d[i + 2];
            }

            return pixels;

        };
        imgs3.forEach(i => {
            if (i.length > 1) {
                var canvas = document.createElement('canvas');
                canvas.width = i[0].naturalWidth * i.length;
                canvas.height = i[0].naturalHeight;
                var ctx = canvas.getContext('2d');
                i.forEach((j, index) => {
                    ctx.drawImage(j, j.naturalWidth * index, 0);
                });
                var originData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                ctx.putImageData(invert(originData), 0, 0);

                var src = canvas.toDataURL('image/png');
                send({
                    src: src,
                    bigUrl: src,
                    width: canvas.width,
                    height: canvas.height,
                },index++)
            } else {
                var img = i[0];
                if (img.src.match('ep_content|ep_thumb1') || img.getAttribute('onclick') === 'show_nav4();') {
                    send({
                        src: img.src,
                        bigUrl: img.src,
                        width: img.naturalWidth,
                        height: img.naturalHeight,
                    },index++)
                }
            }
        })
    } else {
        var imgs = document.querySelectorAll('.swiper-slide-active img');
        imgs.forEach(function (img) {
            if (img.src.match('ep_content|ep_thumb1')) {
                send(img,index++);
            }
        });
    }
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
}

function blobToDataURL(blob, callback) {
    let a = new FileReader();
    a.onload = function (e) {
        callback(e.target.result);
    };
    a.readAsDataURL(blob);
}
aiparser();
