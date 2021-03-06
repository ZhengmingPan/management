import axios from 'axios';
import qs from 'qs';


// 自定义判断元素类型JS
function toType(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

// 参数过滤函数
function filterNull(o) {
    for (var key in o) {
        if (o[key] === null) {
            delete o[key];
        }
        if (toType(o[key]) === 'string') {
            o[key] = o[key].trim();
        } else if (toType(o[key]) === 'object') {
            o[key] = filterNull(o[key]);
        } else if (toType(o[key]) === 'array') {
            o[key] = filterNull(o[key]);
        }
    }
    return o;
}

function apiAxios(method, url, params, success, failure) {
    /*if (params) {
      params = filterNull(params)
    }*/
    if (method === 'POST' || method === 'PUT') {
        params = qs.stringify(params);
    }
    axios({
        method: method,
        url: url,
        data: method === 'POST' || method === 'PUT' ? params : null,
        params: method === 'GET' || method === 'DELETE' ? params : null,
        withCredentials: false,
        responseType: 'json',
        headers: {
            'Accept': 'application/json',
            'content-type': 'application/x-www-form-urlencoded'
        }
    }).then(function (res) {
        if (typeof success == 'function') {
            success(res.data, res.headers);
        }
    }).catch(function (err) {
        if (typeof failure == 'function') {
            failure(err);
        }
    });
}


// 返回在vue模板中的调用接口
export default {
    axios: axios,
    get: function (url, params, success, failure) {
        apiAxios('GET', url, params, success, failure);
    },
    post: function (url, params, success, failure) {
        apiAxios('POST', url, params, success, failure);
    },
    put: function (url, params, success, failure) {
        apiAxios('PUT', url, params, success, failure);
    },
    delete: function (url, params, success, failure) {
        apiAxios('DELETE', url, params, success, failure);
    }
}