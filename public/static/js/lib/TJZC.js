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

        this.ui = {};

        this.__init();
    }

    /**
     * 初始化的配置
     * @private
     */
    __init() {
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


}
module.exports = window.TJZC = TJZC;