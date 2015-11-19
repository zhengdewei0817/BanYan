/**
 * 金额转为纯数字
 * @param str
 * @returns {Number}
 */
export function rmoney(str) {
    return parseFloat(str.replace(/[^\d\.-]/g, ''));
}
/**
 * 金额数字格式化
 * @param money
 * @param n
 * @returns {string}
 */
export function fmoney(money, n) {
    n = n > 0 && n <= 20 ? n : 2;
    money = parseFloat((money + '').replace(/[^\d\.-]/g, '')).toFixed(n) + '';
    var l = money.split('.')[0].split('').reverse();
    var r = money.split('.')[1];

    var t = '';
    var i;
    for (i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '');
    }
    return t.split('').reverse().join('') + '.' + r;
}
/**
 * url解析
 * @param url
 * @returns {{url: *, source: *, protocol: string, host: (*|boolean|string), port: (*|Function|string), query: (*|string|Symbol|string), params, file: *, hash: (XML|string|void|*), path: string, relative: *, segments: Array}}
 */
export function urlParse(url) {
    url = url || window.location.href;
    var _url = url.split('?');
    var a = document.createElement('a');
    a.href = url;
    return {
        url: _url[0],
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function () {
            var ret = {},
                seg = a.search.replace(/^\?/, '').split('&'),
                len = seg.length, i = 0, s;
            for (; i < len; i++) {
                if (!seg[i]) {
                    continue;
                }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [undefined, ''])[1],
        hash: a.hash.replace('#', ''),
        path: a.pathname.replace(/^([^\/])/, '/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [undefined, ''])[1],
        segments: a.pathname.replace(/^\//, '').split('/')
    };
}
/**
 * 元转万元
 * @param str
 * @returns {*}
 */
export function yuan2wan(str) {
    return str < 10000 ? str : (str / 10000) + '万';
}