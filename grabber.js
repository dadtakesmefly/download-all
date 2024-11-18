
var img_cnki = {};
var groupIndex = 0;
function grabAllImgTags(doc) {
    let list = [];
    for (let el of Array.from(doc.getElementsByTagName('img'))) {
        let url = el.src;
        /*if (el.src.indexOf('//photo.yupoo.com') === 0) url = 'https:' + url;*/
        if (!img_cnki[url]) {
            list.push({
                type: 'image',
                url: url,
                title: document.title,
                groupIndex: groupIndex++
            });
            img_cnki[url] = true;
        }
    }
    return list;
}

function grabAllBackgroundImages(doc) {
    let list = [];
    const srcChecker = /url\(\s*?['"]?\s*?(\S+?)\s*?["']?\s*?\)/i;
    const pseudo = [null,'before','after','hover'];
    for (let el of Array.from(doc.querySelectorAll('*'))) {
        pseudo.forEach(t => {
            let prop = window.getComputedStyle(el, t).getPropertyValue('background-image');
            let match = srcChecker.exec(prop);
            if (match && !img_cnki[match[1]]) {
                /*let url = match[1];
                console.log(url,'url')
                if (el.src.indexOf('//photo.yupoo.com') === 0) url = 'https:' + url;*/
                list.push({
                    type: 'image',
                    url: match[1],
                    title: document.title,
                    groupIndex: groupIndex++
                });
                img_cnki[match[1]] = true;
            }
        })
    }
    return list;
}


function getAllDoc(doc = document) {
    let docs = [doc];
    for (let iframe of Array.from(doc.querySelectorAll('iframe'))) {
        try {
            docs = docs.concat(getAllDoc(iframe.contentDocument || iframe.contentWindow.document));
        } catch (e) {

        }
    }
    return docs;
}


// 去重
function filterList(list) {
    let newList = [];
    let allUrl = {};
    for (let item of list) {
        if (item.url === '' || allUrl[item.url]) {
            continue;
        }
        allUrl[item.url] = true;
        newList.push(item);
    }
    return newList;
}

function grabAll() {
    let list = [];
    let docs = getAllDoc();
    for (let doc of docs) {
        list = list.concat(grabAllImgTags(doc)).concat(grabAllBackgroundImages(doc))
    }
    list = filterList(list);
    chrome.runtime.sendMessage({tip:'resGrabberImgList',list:list});
    return list;
}

grabAll();
