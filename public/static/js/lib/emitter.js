import TC from './TC';

class Emitter extends TC {
    constructor() {
        super();
        this.callbacks = [];
    }

    /**
     * 绑定
     * @param event     事件名
     * @param fn        绑定函数
     * @returns {Emitter}
     */
    on(event, fn) {
        let cb = this.callbacks[event];
        this.callbacks[event] = cb || [];
        this.callbacks[event].push(fn);
        return this;
    }

    /**
     * 解绑
     * @param event         事件名
     * @param fn            解绑函数
     * @returns {Emitter}
     */
    off(event, fn) {
        let cbs = this.callbacks[event];
        if (!cbs)
            return this;

        // 如果只有一个参数解除所有绑定
        if (arguments.length === 1) {
            delete this.callbacks[event];
            return this;
        }

        let index = cbs.indexOf(fn);
        cbs.splice(index, 1);

        return this;

    }

    /**
     * 单词绑定
     * @param event
     * @param fn
     * @returns {Emitter}
     */
    once(event, fn) {
        let _this = this;

        let __one = function () {
            _this.off(event, __one);
            fn.apply(this, arguments);
        };

        this.on(event, () => {
            this.off(event, fn);
            fn.apply();
        });

        return this;
    }

    /**
     * 绑定一组
     * @param event
     * @returns {Emitter}
     */
    emit(event) {
        let args = [].slice.call(arguments, 1);
        let cbs = this.callbacks[event];

        if (cbs) {
            for (var i = 0, len = cbs.length; i < len; i++)
                cbs[i].apply(this, args);
        }

        return this;
    }

}

export default Emitter;