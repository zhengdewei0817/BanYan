(function(window, $){
    var noop = function(){};
    var csrfNode = $('[name=_csrf]');
    /**
     * ajax请求
     * @param config
     * @constructor
     */
    function Request(config){
        var _self = this;

        config = config || {};
        config.data = config.data || {};
        // 同步异步
        if($.type(config.async) == 'undefined')
            config.async = true;

        // 未定义url 直接报错
        if(!config.url)
            throw new Error('请求地址未定义!');

        this._failCb = noop;
        this._resolveCb = noop;

        if(PAGE_CONFIG._csrf){
            if(typeof config.data == 'string' && config.data.indexOf('_csrf')){
                config.data += '&_csrf=' + PAGE_CONFIG._csrf;
            }else if(!config.data._csrf){
                config.data._csrf = PAGE_CONFIG._csrf;
            }
        }

        $.ajax({
            type: config.type || 'get',
            url: config.url,
            data: config.data,
            async: config.async,
            dataType: "json",
            success: function(res){
                if(res.code != '0000'){
                    _self._failCb && _self._failCb(res);
                } else {
                    _self._resolveCb && _self._resolveCb(res.data);
                }
                _self._done && _self._done(res.code == '0000', res);
            }
        });
    }

    Request.prototype.done = function(cb){
        this._done = cb;
    }

    Request.prototype.fail = function(cb){
        this._failCb = cb;
        return this;
    };

    Request.prototype.resolve = function(cb){
        this._resolveCb = cb;
        return this;
    };

    window.request = function(options){
        return new Request(options);
    };
})(this, this.Zepto || this.jQuery);