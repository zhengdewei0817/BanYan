const form = {
    /**
     * 获取value
     * @param el
     * @returns {*}
     */
    elValue: (el) => {
        el = $(el);
        let type = el.attr('type');
        let val = $.trim(el.val());

        if (type === 'radio' || type === 'checkbox') {
            return $('input[name=' + el.attr('name') + ']:checked').val();
        }
        if (typeof val === 'string') {
            return val.replace(/\r/g, '');
        }
        return val;
    },
    /**
     * 检查是否为checkbox/radio
     * @param el
     * @returns {boolean}
     */
    checkable: el => {
        return /radio|checkbox/i.test(el[0].type);
    },
    /**
     * 获取length
     * @param el
     * @returns {Number|jQuery}
     */
    getLength: el => {
        return $(el).filter(':checked').length;
    },
    /**
     * 获取表单元素
     * @param form
     * @param callback
     */
    getInps: (form, callback) => {
        let inps = form.find('input');

        $.each(inps, function(){
            let el = $(this);
            let type = el.attr('type');
            let ignore = el.data('ignore');
            let name = el.attr('name');
            // 忽略不需要提交的input
            if (type === 'submit' || type === 'button' || ignore || !name){
                return;
            }

            callback && callback(el);
        });
    },
    /**
     * 获取form表单数据
     * @param form
     * @returns {{}}
     */
    serializeJson: form => {
        let obj = {};

        form.getInps(form, (el) => {
            // 防止选取所有checkbox
            if (!el.is(':checked') && form.checkable(el))
                return;

            obj[name] = form.elValue(el);
        });
        return obj;
    }
};

const str = {
    /**
     * 金额转为纯数字
     * @param str
     * @returns {Number}
     */
    rmoney: str => {
        return parseFloat(str.replace(/[^\d\.-]/g, ''));
    },
    /**
     * 金额数字格式化
     * @param money
     * @param n
     * @returns {string}
     */
    fmoney: (money, n) => {
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
    },
    /**
     * url解析
     * @param url
     * @returns {{url: *, source: *, protocol: string, host: (*|boolean|string), port: (*|Function|string), query: (*|string|Symbol|string), params, file: *, hash: (XML|string|void|*), path: string, relative: *, segments: Array}}
     */
    urlParse: (url = window.location.href) => {
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
            params: (() => {
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
    },
    /**
     * 元转万元
     * @param str
     * @returns {*}
     */
    yuan2wan: (str) => {
        return str < 10000 ? str : (str / 10000) + '万';
    },
    /**
     * 格式化字符串
     * @param source
     * @param params
     * @returns {*}
     */
    format: (source, ...params) => {
        $.each(params, (i, n) => {
            source = source.replace(new RegExp('\\{' + i + '\\}', 'g'), function () {
                return n;
            });
        });
        return source;

    }
};

export default {
    string: str,
    form: form
};