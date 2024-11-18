
function aiparser(){
    function send(img){
        chrome.runtime.sendMessage({tip:'resGrabberImgRow',row:{url: img.src, title: document.title}});
    }
    var text = '';
    document.querySelectorAll('script').forEach((aa,i)=>{
        if(aa.innerText.match('^.._initDataCallback')){
            text = aa.innerText;
        }
    });
    text.match(/\[\"(.*?)\",\d+,\d+\]/g).forEach(t => {
        var ts = t.split('"');
        if (ts.length === 3) {
            send({src:ts[1]})
        }
    })
}
aiparser();

