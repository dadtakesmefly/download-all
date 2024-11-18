export const rules = [
    {
        "defaultEnabled": true,
        "site": "topit.me",
        "srcPattern": "https?://.{2,}.topit.me/.*",
        "replaceRule1": [/[/][mst][/]/g,/[mst][.]jpg/g,/[/][mst]/g],
        "replaceRule2": ['/l/','l.jpg','/l']
    },
    {
        "defaultEnabled": true,
        "site": "bilibili",
        "srcPattern": "i\\d\\.hdslb\\.com",
        "replaceRule1": [/@(\d+[a-z]_?)+\.webp$/i],
        "replaceRule2": ['']
    }
    ,
    {
        "defaultEnabled": true,
        "site": "新浪微博",
        "srcPattern": "https?://.*[.]sinaimg[.]cn/.*",
        "replaceRule1": [/[/]small[/]/,/[/]square[/]/,/[/]thumbnail[/]/,/[/]bmiddle[/]/,/[/]thumb[\d]*[/]/,/[/]mw[\d]+[/]/,/\/orj\d+\//],
        "replaceRule2": ['/large/','/large/','/large/','/large/','/large/','/large/','/large/']
    }
    ,
    {
        "defaultEnabled": true,
        "site": "QQ相册/空间",
        "srcPattern": "https?://.*[.]photo[.]store[.]qq[.]com/.*",
        "replaceRule1": [/[/]m[/]/,/&w=[\d]+&h=[\d]+/],
        "replaceRule2": ['/o/','']
    },
    {
        "defaultEnabled": true,
        "site": "QQ相册/空间 - new",
        "srcPattern": "qpic.cn/psb",
        "replaceRule1": [/\/m\//],
        "replaceRule2": ['/b/']
    },
    {
        "defaultEnabled": true,
        "site": "考拉海购",
        "srcPattern": "pop.nosdn.127.net|haitao.nosdn\\d+.127.net|haitao.nos.netease.com",
        "replaceRule1": [/\?imageView.*/],
        "replaceRule2": ['']
    }
    ,
    {
        "defaultEnabled": true,
        "site": "QQ相册2",
        "srcPattern": "https?://group[.]store[.]qq[.]com/.*",
        "replaceRule1": [/[\/]400$/,/[/]200$/,/[/]100$/],
        "replaceRule2": ['/800','/800','/800']
    },
    {
        "defaultEnabled": true,
        "site": "Twitter",
        "srcPattern": "https://pbs.twimg.com/media/.*\\?format=",
        "replaceRule1": [/format=(.+?)\b.*/],
        "replaceRule2": ['format=$1&name=4096x4096']
    },
    {
        "defaultEnabled": true,
        "site": "百度图趣",
        "srcPattern": "https?://hiphotos[.]baidu[.]com/.*",
        "replaceRule1": [/[/]abpic[/]/,/[/]pin[/]w=[\d]+[/].+[/]/],
        "replaceRule2": ['/pic/','/pin/pic/item/']
    }
    ,
    {
        "defaultEnabled": true,
        "site": "豆瓣相册",
        "srcPattern": "https?://img[\\d]*[.]douban(io)?[.]com/.*",
        "replaceRule1": [/[/]thumb[/]/,/[/]albumicon[/]/,'photo/m/'],
        "replaceRule2": ['/photo/','/photo/','photo/l/']
    }
    ,
    {
        "defaultEnabled": true,
        "site": "花瓣",
        "srcPattern": "https?://img[.]hb[.]aicdn[.]com/.*|hbimg.huabanimg.com",
        "replaceRule1": [/_fw[\d]+[w]*$|_\/fw\/\d+.*|_fw[\d]+.*$/],
        "replaceRule2": ['']
    }
    ,
    {
        "defaultEnabled": true,
        "site": "Flickr",
        "srcPattern": ".*[.]staticflickr[.]com.*",
        "replaceRule1": [/_[ms]\.jpg$/],
        "replaceRule2": ['_b.jpg']
    }
    ,
    {
        "defaultEnabled": true,
        "site": "Google+",
        "srcPattern": "http.*lh.*\\.googleusercontent\.com.*",
        "replaceRule1": [/[/]w\d+-h\d+(-n)*-k[/]/],
        "replaceRule2": ['/s1600/']
    },
    {
        "defaultEnabled": true,
        "site": "迅雷方舟",
        "srcPattern": "http.*\\.xlpan\\.kanimg\\.com.*",
        "replaceRule1": [/&s=.*[\d]+.*$/],
        "replaceRule2": ['&s=1600']
    },
    {
        "defaultEnabled": true,
        "site": "poco.cn",
        "srcPattern": "http.*image[\\d]*-c.poco.cn.*",
        "replaceRule1": [/_\d{3}.jpg$/],
        "replaceRule2": ['.jpg']
    },
    {
        "defaultEnabled": true,
        "site": "pconline太平洋摄影",
        "srcPattern": "http.*.pconline.com.cn.*",
        "replaceRule1": [/_mthumb.jpg$/,/_thumb.jpg$/],
        "replaceRule2": ['.jpg','.jpg']
    },
    {
        "defaultEnabled": true,
        "site": "yangkeduo",
        "srcPattern": "(img\.pddpic\.com|img.yangkeduo.com)",
        "replaceRule1": [/\/webp$/i],
        "replaceRule2": ['jpg']
    },
    {
        "defaultEnabled": true,
        "site": "美丽说",
        "srcPattern": "(http.*[.]meilishuo[.]net.*)|(http.*[.]meiliworks[.]com.*)",
        "replaceRule1": [/[/]l[/]/,/[/]r[/]/],
        "replaceRule2": ['/_o/','/_o/']
    },
    {
        "defaultEnabled": true,
        "site": "蘑菇街",
        "srcPattern": "https?://.*[.]mogujie[.]cn/.*",
        "replaceRule1": [/_[\d]{3}x[\d]+.jpg$/],
        "replaceRule2": ['_468x468.jpg']
    },
    {
        "defaultEnabled": true,
        "site": "又拍网",
        "srcPattern": "https?://photo.yupoo.com/.*.jpg",
        "replaceRule1": [/(square.jpg$)|(fw200.jpg$)/],
        "replaceRule2": ['medish.jpg']
    },
    {
        "defaultEnabled": true,
        "site": "brickvisual",
        "srcPattern": "https?://brickvisual.com/.*.jpg",
        "replaceRule1": [/-\d+x\d+\.jpg$/],
        "replaceRule2": ['.jpg']
    },
    {
        "defaultEnabled": true,
        "site": "archdaily",
        "srcPattern": "https?://images.adsttc.com.qtlcn.com/media/images/.*?.jpg.*?",
        "replaceRule1": [/\/\w+\/([\w%]+)\.jpg.*?/],
        "replaceRule2": ['/large_jpg/$1.jpg']
    },
    {
        "defaultEnabled": true,
        "site": "hao123美图",
        "srcPattern": "http.*img.*[.]hao123[.]com.*",
        "replaceRule1": [/_310$/],
        "replaceRule2": ['_0']
    },
    {
        "defaultEnabled": true,
        "site": "pinterest",
        "srcPattern": "https?://.*[.]pinimg[.]com/.*.jpg",
        "replaceRule1": [/[/]2([\d]+)x[/]/,/474/,/i.pinimg.com\/\d+x.*?\//],
        "replaceRule2": ['/7$1x/','736','i.pinimg.com/originals/']
    },
    {
        "defaultEnabled": true,
        "site": "1688",
        "srcPattern": "https?://cbu01.alicdn.com/img/ibank/.*\\..*x.*\\.jpg",
        "replaceRule1": [/_\.webp$/,/\.\d+x\d+\./,'.220x220xz.'],
        "replaceRule2": ['','.','.']
    },
    {
        "defaultEnabled": true,
        "site": "淘宝天猫",
        "srcPattern": "alicdn.com",
        "replaceRule1": [/_\.webp/,/\.jpg\_\d+x\d+\.jpg$/,/_\d+x\d+\.jpg$/,/_\d+x\d+q\d+\.jpg$/,/\.\d+x\d+\.jpg$/,/\.jpg_\d+x\d+xzq\d+\.jpg$/,/_\d+x\d+.*?\.(jpg|webp|png)$/],
        "replaceRule2": ['','.jpg','_800x800.jpg','','.jpg','.jpg','']
    },
    {
        "defaultEnabled": true,
        "site": "京东",
        "srcPattern": "360buyimg.com",
        "replaceRule1": [/\/n\d+\//,/s\d+x\d+_jfs/,/!cc_50x64.jpg$/,/\!q\d+\.dpg\.webp$/],
        "replaceRule2": ['/imgzone/','jfs','','']
    },
    {
        "defaultEnabled": true,
        "site": "唯品会",
        "srcPattern": "a.vpimg\\d+.com/upload",
        "replaceRule1": [/(_\d+)*x\d+(_\d+)*.jpg/],
        "replaceRule2": ['.jpg']
    },
    {
        "defaultEnabled": true,
        "site": "Amazon",
        "srcPattern": "images-na.ssl-images-amazon.com/images",
        "replaceRule1": [/\.[^./]+\.jpg/],
        "replaceRule2": ['.jpg']
    },
    {
        "defaultEnabled": true,
        "site": "小红书",
        "srcPattern": "ci.xiaohongshu.com",
        "replaceRule1": [/\?imageView2\/2\/w\/100\/h\/100\/q\/90/],
        "replaceRule2": ['']
    },
    {
        "defaultEnabled": true,
        "site": "airbnb",
        "srcPattern": "muscache..+/im/pictures",
        "replaceRule1": [/\?aki_policy=.*|\?tdsourcetag=s_pcqq_aiomsg/],
        "replaceRule2": ['?aki_policy=xx_large']
    },
    {
        "defaultEnabled": true,
        "site": "美工云",
        "srcPattern": "src.meigongyun.com/forum.*\\.jpg-png_gif",
        "replaceRule1": [/\.jpg-png_gif/],
        "replaceRule2": ['.jpg-homeSlide']
    },
    {
        "site": "shein.com",
        "srcPattern": "//img.ltwebstatic.com/images2_pi/.*_thumbnail.*\\.jpg",
        "replaceRule1": [/_thumbnail.*?\./],
        "replaceRule2": ['.']
    },
    {
        "defaultEnabled": true,
        "site": "易派客 epec.com",
        "srcPattern": "//img.epec.com/.*\\.(jpg|png)",
        "replaceRule1": [/\.(jpg|png).\d+w_\d+h_.*/],
        "replaceRule2": ['.$1']
    },
    {
        "defaultEnabled": true,
        "site": "pailixiang.com",
        "srcPattern": "http://img.pailixiang.com.*@!(pbig|psmall)",
        "replaceRule1": [/.!(pbig|psmall)/],
        "replaceRule2": ['']
    },
    {
        "defaultEnabled": true,
        "site": "aikucun",
        "srcPattern": "akmer.aikucun.com/",
        "replaceRule1": [/\?x-oss-process.*/],
        "replaceRule2": ['']
    },
    {
        "defaultEnabled": true,
        "site": "lookbooks.com",
        "srcPattern": "amazonaws.com.*/lg_|lookbookspro.com.*/lg_",
        "replaceRule1": [/\/lg_/],
        "replaceRule2": ['/gxl_']
    },
    {
        "defaultEnabled": true,
        "site": "www.aplusprod.com",
        "srcPattern": "images.squarespace-cdn.com/content/.*?format=\\d+w",
        "replaceRule1": [/\?format=\d+w/],
        "replaceRule2": ['']
    },
    {
        "defaultEnabled": true,
        "site": "unsplash.com",
        "srcPattern": "images.unsplash.com/photo-",
        "replaceRule1": [/&auto=format&.*|&w=\d+.*/],
        "replaceRule2": ['']
    },
    {
        "defaultEnabled": true,
        "site": "m.inmuu.com",
        "srcPattern": "s.tupianzhibo.cn/image/jpeg.*!listpc",
        "replaceRule1": [/!listpc/],
        "replaceRule2": ['']
    },
    {
        "defaultEnabled": true,
        "site": "www.reiss.com",
        "srcPattern": "www.reiss.com/media/product",
        "replaceRule1": [/\?format=.*/],
        "replaceRule2": ['']
    },
    {
        "defaultEnabled": true,
        "site": "微相册",
        "srcPattern": "xcimg.szwego.com/.*.jpg\\?imageMogr2.*",
        "replaceRule1": [/\?imageMogr2.*/],
        "replaceRule2": ['']
    },
    {
        "defaultEnabled": true,
        "site": "人人网",
        "srcPattern": "fmn.xnpic.com|fmn.rrfmn.com",
        "replaceRule1": [/\p\/(.*?)_p/],
        "replaceRule2": ['p']
    },
    {
        "defaultEnabled": true,
        "site": "知乎",
        "srcPattern": "pic\\d.zhimg.com",
        "replaceRule1": [/\.com\\\d+\//,'_hd.'],
        "replaceRule2": ['.com/', '_r.']
    },
    {
        "defaultEnabled": true,
        "site": "堆糖",
        "srcPattern": "duitang.com/uploads/item/.*\\.thumb\\.",
        "replaceRule1": [/\.thumb.*\./],
        "replaceRule2": ['.']
    },
    {
        "defaultEnabled": true,
        "site": "POCO",
        "srcPattern": "pocoimg.cn/image/poco",
        "replaceRule1": [/_W\d+.jpg/],
        "replaceRule2": ['.jpg']
    },
    {
        "defaultEnabled": true,
        "site": "DHgate",
        "srcPattern": "www.dhresource.com",
        "replaceRule1": [/\/\d+x\d+(s?)\//],
        "replaceRule2": ['/0x0$1/']
    },
    {
        "defaultEnabled": true,
        "site": "yzcdn",
        "srcPattern": "img.yzcdn.cn/upload_files",
        "replaceRule1": [/!large.webp/],
        "replaceRule2": ['']
    },
    {
        "defaultEnabled": true,
        "site": "途家民宿",
        "srcPattern": "pic.tujia.com/upload/.*/thumb/",
        "replaceRule1": ['_300_200'],
        "replaceRule2": ['_1500_1003']
    },
    {
        "defaultEnabled": true,
        "site": "kidsfootlocker",
        "srcPattern": "images.footlocker.com",
        "replaceRule1": ['&fmt=png-alpha',/wid=\d+/,/hei=\d+/],
        "replaceRule2": ['','wid=640','hei=640']
    },
    {
        "defaultEnabled": false,
        "site": "美叶 www.meiye.art",
        "srcPattern": "images.psketch.com",
        "replaceRule1": [/_min_.*/,'?imageView2/2/w/500'],
        "replaceRule2": ['','']
    },
    {
        "defaultEnabled": false,
        "site": "caselio.com",
        "srcPattern": "medias-caselio.e-systemes",
        "replaceRule1": [/_\d+\.jpg$/],
        "replaceRule2": ['.jpg']
    },
    {
        "defaultEnabled": false,
        "site": "gallery.vphotos.cn",
        "srcPattern": "img.vphotos.cn",
        "replaceRule1": ['logothumb'],
        "replaceRule2": ['logosmall']
    },
    {
        "defaultEnabled": false,
        "site": "bp.pep.com.cn",
        "srcPattern": "bp.pep.com.cn/ebook/",
        "replaceRule1": ['/thumb/'],
        "replaceRule2": ['/mobile/']
    },
    {
        "defaultEnabled": false,
        "site": "www.archdaily.com",
        "srcPattern": "images.adsttc.com",
        "replaceRule1": ['/thumb_jpg/'],
        "replaceRule2": ['/slideshow/']
    },
    {
        "defaultEnabled": true,
        "site": "洋码头 ymatou.com",
        "srcPattern": "pic\\d+.ymatou.com/",
        "replaceRule1": ['_i.jpg'],
        "replaceRule2": ['_o.jpg']
    },
    {
        "defaultEnabled": true,
        "site": "站酷",
        "srcPattern": "img.zcool.cn/community",
        "replaceRule1": [/@.*/],
        "replaceRule2": ['']
    },
    {
        "defaultEnabled": false,
        "site": "FURLA",
        "srcPattern": "furla-cdn.thron.cn/delivery/public/image",
        "replaceRule1": [/\/std\/\d+x\d+/],
        "replaceRule2": ['/std/1000x1000']
    },
    {
        "defaultEnabled": false,
        "site": "图虫网",
        "srcPattern": "photo.tuchong.com|pstatp.com/weili",
        "replaceRule1": [/\/ft\d+\//,'/sm/'],
        "replaceRule2": ['/f/','/l/']
    },
    {
        "defaultEnabled": false,
        "site": "Pexels",
        "srcPattern": "images.pexels.com",
        "replaceRule1": [/\?.*/],
        "replaceRule2": ['']
    },
    {
        "defaultEnabled": true,
        "site": "Youtuge",
        "srcPattern": "i.ytimg.com/",
        "replaceRule1": ['hqdefault'],
        "replaceRule2": ['maxresdefault']
    },
    {
        "defaultEnabled": true,
        "site": "Pinduoduo",
        "srcPattern": "review.pddpic.com/",
        "replaceRule1": [/\?.*?format\/webp$/],
        "replaceRule2": ['']
    }
];

