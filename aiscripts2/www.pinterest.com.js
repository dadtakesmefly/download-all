var li = {};
var img_cnki = {};
var groupIndex = 0;
function aiparser(){
    var index = 0;
    function send(img){
        if (!li[img.url]) {
            chrome.runtime.sendMessage({tip:'resGrabberImgRow',row:img, groupIndex: groupIndex++});
            li[img.url] = true;
        }
    }
    var r = document.getElementById("initial-state"), a = 0;
    if (r && (r = JSON.parse(r.innerText)).location.pathname === location.pathname && r.resources.data.BoardResource) {
        var o = Object.keys(r.resources.data.BoardResource)[0], n = r.resources.data.BoardResource[o].data, i = "",
            s = new Headers;
        return s.append("x-app-version", "2a5f713"), s.append("x-pinterest-appstate", "active"), s.append("x-requested-with", "XMLHttpRequest"), function r() {
            var a = {
                options: {
                    isPrefetch: !1,
                    board_id: n.id,
                    board_url: n.url,
                    field_set_key: "react_grid_pin",
                    filter_section_pins: !0,
                    layout: "default",
                    page_size: 25,
                    redux_normalize_feed: !0
                }, context: {}
            };
            i && (a.options.bookmarks = i), fetch(location.protocol + "//" + location.host + "/resource/BoardFeedResource/get/?source_url=" + encodeURIComponent(location.pathname) + "&data=" + encodeURIComponent(JSON.stringify(a)), {
                credentials: "include",
                headers: s
            }).then(function (e) {
                return e.json()
            }).then(function (a) {
                var o = a.resource_response.data;
                o.length > 0 && (o.forEach(function (r) {
                    var a;
                    r.images && (send({
                        url: r.images.orig.url,
                        title: document.title,
                        groupIndex: index++
                    }))
                }), i = a.resource.options.bookmarks, r())
            })
        }(), void (a = 1)
    } else {
        grabAll();
    }
}

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
aiparser();
