import axios from 'axios';
import env from '../config/env';

let util = {};
util.title = function (title) {
    title = title ? title + ' - 数据管理平台' : '欢迎进入数据管理平台';
    window.document.title = title;
};

const ajaxUrl = env === 'development' ?
    'http://127.0.0.1:9000' :
    env === 'production' ?
        'https://www.url.com' :
        'https://debug.url.com';

util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000
});

export default util;
