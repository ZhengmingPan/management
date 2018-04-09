const set = (name, value, days) => {
    let expireTime = new Date();
    expireTime.setTime(expireTime.getTime() + (days * 24 * 60 * 60 * 1000));
    let expires = 'expires=' + expireTime.toUTCString();
    document.cookie = name + '=' + value + ';' + expires;
};

const get = (name) => {
    var cookieName = name + '=';
    var cookieArray = document.cookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) == '')
            cookie = cookie.substring(1);
        if (cookie.indexOf(cookieName) != -1)
            return cookie.substring(cookieName.length + 1, cookie.length);
    }
    return '';
};

const clear = (name) => {
    set(name, '', -1);
};

const exist = (name) => {
    var value = get(name);
    return value != '' && value != null && value != undefined;
};

export default {set: set, get: get, clear: clear, exist: exist};