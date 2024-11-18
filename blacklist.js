
import config from "@/js/config";
export const blacklist = {
  "https://soundcloud.com" : true,
  "https://www.ximalaya.com" : true,
  "https://www.iqiyi.com" : config.source === '360-store'
};
