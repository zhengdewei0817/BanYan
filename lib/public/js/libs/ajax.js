(function(window, $){
    var noop = function(){};
    /**
     * ajax请求
     * @param config
     * @constructor
     */
    function request(config){
        var _self = this;

        config = config || {};
        config.data = config.data || {};
        // 同步异步
        if($.type(config.async) == 'undefined')
            config.async = true;

        // 未定义url 直接报错
        if(!config.url)
            throw new Error('请求地址未定义!');

        $.ajax({
            type: config.type || 'get',
            url: config.url,
            data: config.data,
            async: config.async,
            dataType: "json",
            success: function(res){
                if(res.error_messages){
                    config.error && config.error(res);
                } else {
                    config.success && config.success(res.data);
                }
            }
        });
    }

    window.request = request;

})(this, this.Zepto || this.jQuery);