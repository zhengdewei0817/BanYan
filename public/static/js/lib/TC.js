import ajax from './ajax';
import nt from './nt';
import util from './util';

class TJZC {
    constructor() {
        // 唯一
        this.uuid = 0;
        // 当前时间
        this.now = this.getNow();
        this.config = {};

        this.ajax = ajax;
        this.util = util;
        this.tpl = nt.tpl;

        this.events = {};

        this.__init();
    }

    run (){
        this.init && this.init();
        this.delegateEvents();
    }

    /**
     * 初始化的配置
     * @private
     */
    __init() {
    }

    setConf (config){
        this.config = $.extend({}, this.config, config);
    }

    /**
     * 日志
     */
    debug() {
        if (!window.console)
            return;
        window.console.log.call(null, arguments);
    }

    /**
     * 获取当前时间
     * @returns {number}
     */
    getNow() {
        return new Date().getTime();
    }

    /**
     * 获取唯一值
     */
    uniqueId() {
        this.uuid = this.now() + 1;
    }

    // noop
    noop() {
    }

    /**
     * 事件绑定
     */
    delegateEvents (){
        let key;
        for (key in this.events) {
            let methodName = this.events[key];
            let method = this[methodName] || this.noop;
            let match = key.match(/^(\w+)\s*(.*)$/);
            let eventName = match[1];
            let selector = match[2];

            if (selector === '') {
                this.el.on(eventName, (event) => {
                    return method.call(this, event);
                });
                return this;
            }

            this.el.on(eventName, selector, (event) => {
                return method.call(this, event);
            });
            return this;
        }
    }
}
module.exports = window.TJZC = TJZC;