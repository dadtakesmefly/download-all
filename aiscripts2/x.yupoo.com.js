
var setToCookieFielddd = ['id', 'username', 'token', 'refreshToken', 'vip', 'email'];
var fieldName = 'impress';
var cache = {};
var getJSONFromStorage = (key, storage = window.localStorage) => {
    try {
        const value = storage.getItem(key) || undefined;
        return typeof value === 'object' ? value : JSON.parse(value);
    } catch (e) {
        storage.removeItem(key);
    }
};

var storage = {
    getToken: function () {
        const user = this.getUser();
        if (!user) return;
        return user.token;
    },
    getRefreshToken: function () {
        const user = this.getUser();
        if (!user) return;
        return user.refreshToken;
    },
    setLanguage: function (lang) {
        return this.setItem('language', lang);
    },
    getLanguage: function () {
        return this.getItem('language');
    },
    clearLanguage: function () {
        this.removeItem('language', '/', this.getCookieRootDomain());
        return this.removeItem('language');
    },
    getUsername: function () {
        const user = this.getItem(fieldName);
        try {
            return JSON.parse(user).username;
        } catch (e) {
            return;
        }
    },
    getUser: function () {
        let userObj;
        const user = this.getItem(fieldName);
        if (!user) return;
        try {
            userObj = JSON.parse(user);
        } catch (e) {
            this.clearUser();
        }
        return userObj;
    },
    setUser: function (user, expired) {
        const userToCookie = {};
        setToCookieFielddd.forEach(prop => userToCookie[prop] = user[prop]);
        localStorage.setItem('current_username', user.username);
        localStorage.setItem('logged', true);
        return this.setItem(fieldName, JSON.stringify(userToCookie), expired);
    },
    clearUser: function () {
        this.removeItem(fieldName, '/', this.getCookieRootDomain());
        this.removeItem(fieldName);
        return true;
    },
    getInactiveUsers: function () {
        if (cache.inactiveusers) return cache.inactiveusers;
        const users = getJSONFromStorage('inactiveusers') || [];
        cache.inactiveusers = users;
        return users;
    },
    setInactiveUser: function (user) {
        if (!user) return;
        const currentUser = this.getUser();
        if (user.id === currentUser.id) {
            localStorage.removeItem('current_username');
        }
        localStorage.removeItem('logged');
        const inactiveUsers = this.getInactiveUsers();
        const index = inactiveUsers.findIndex(({id}) => id === user.id);
        if (index > -1) return true;
        inactiveUsers.push(user);
        return localStorage.setItem('inactiveusers', JSON.stringify(inactiveUsers));
    },
    removeInactiveUser: function (id) {
        const inactiveUsers = this.getInactiveUsers();
        const index = inactiveUsers.findIndex(user => id === user.id);
        if (index === -1) return true;
        inactiveUsers.splice(index, 1);
        return localStorage.setItem('inactiveusers', JSON.stringify(inactiveUsers));
    },
    clearCache: function (sKey) {
        if (sKey) {
            delete cache[sKey];
        } else {
            cache = {};
        }
    },
    getItem: function (sKey) {
        if (sKey in cache) return cache[sKey];
        const value = decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
        return cache[sKey] = value;
    },
    setItem: function (sKey, sValue, vEnd = Infinity, sPath = '/', sDomain = this._primaryDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
        let sExpires = '';
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + vEnd;
                    break;
                case String:
                    sExpires = '; max-age=' + vEnd;
                    break;
                case Date:
                default:
                    sExpires = '; max-age=' + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + '=' + encodeURIComponent(sValue) + sExpires + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '') + (bSecure ? '; secure' : '');
        cache[sKey] = sValue;
        return true;
    },
    removeItem: function (sKey, sPath = '/', sDomain = this._primaryDomain) {
        if (!sKey || !this.hasItem(sKey)) { return false; }
        document.cookie = encodeURIComponent(sKey) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + ( sDomain ? '; domain=' + sDomain : '') + ( sPath ? '; path=' + sPath : '');
        delete cache[sKey];
        return true;
    },
    hasItem: function (sKey) {
        return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie);
    },
    keys: function () {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:\=[^;]*)?;\s*/);
        for (let nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
        return aKeys;
    },
    getCookieRootDomain () {
        const d = window.location.host.split(':').shift().split('.');
        let tmpCookie;
        let partDomain;
        let rdl = d.length;
        if (rdl === 1) {
            return '';
        } else {
            tmpCookie = 'TMP' + (+new Date);
            while (rdl-- > 2) {
                partDomain = d.slice(1).join('.');
                document.cookie = tmpCookie + '=' + tmpCookie + '; domain=' + partDomain;
                tmpCookie = this.getItem(tmpCookie);
                document.cookie = tmpCookie + '=1; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=' + partDomain;
                if (!tmpCookie) {
                    break;
                }
                d.shift();
            }
            return d.join('.');
        }
    },
    _primaryDomain: window.location.hostname
};

window.addEventListener('storage', function ({key}) {
    if (document.hasFocus()) return;
    if (key === 'logged') location.reload();
});

function aiparser(tabInfo){
    var imgList = [];
    var li = {};

    function send(src) {
        if (!li[src]) {
            imgList.push({url:src,title:document.title});
            li[src] = true;
        }
    }
    if (location.href.match('x.yupoo.com/gallery/')) {
        var userObj = storage.getUser();
        var Authorization = 'Bearer ' + userObj.token;
        var i = location.href.split('/')[location.href.split('/').length-1];
        var username = document.querySelectorAll('a[class="onlydesktop"]')[0].innerText;
        var url = 'https://x.yupoo.com/api/albums/'+i+'/photos?_username='+username+'&page=1';
        const xhr = new XMLHttpRequest();
        xhr.open('get',url,true);
        xhr.setRequestHeader('Authorization', Authorization);
        xhr.responseType = 'json';
        xhr.send();
        xhr.onload = ()=>{
            xhr.response.data.list.forEach(row => {
                chrome.runtime.sendMessage({tip:'resGrabberImgRow',row:{url:'https://pic.yupoo.com/' + row.path,title: document.title}});
            })
        };
    } else {
        document.querySelectorAll('img').forEach(function(img){
            var bigSrc = img.dataset.originSrc || img.src.replace(/\/(small|medium)\./, '/large.');
            bigSrc = bigSrc.replace(/^\/\//, location.protocol+'//');
            send(bigSrc);
        });
        chrome.runtime.sendMessage({tip:'resGrabberImgList',list:imgList});
    }
}
aiparser();


