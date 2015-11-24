import Emitter from '../lib/emitter';

let __MSG__ = {};
let __METHOD__ = {};

const DEFAULT_CONFIG = {
    ignore: 'ignore',
    // 各种样式
    focusCls: null,
    successCls: 'ui-validate-success',
    errorCls: 'ui-validate-error',
    // <input data-validate="username" /> 
    validKey: 'validate',
    // 规则
    rules: {},
    // 错误信息
    message: {},
    errorParent: '.validate-parent',
    // 错误信息
    errorWrap: `<div class="tc-form-message-inline">{$1}</div>`,
    remoteCallback: () => {
    },
    ajaxSubmit: function () {
        this.ajax({
            type: this.el.attr('method'),
            url: this.el.attr('action'),
            data: this.util.form.serializeJson(this.el),
            dataType: 'json',
            success: this.config.success,
            error: this.config.error
        });
    }
};
/**
 * 表单验证类
 *
 * @example
 *
 * new Validate(form).init();
 *
 * or
 *
 * new Validate.setConfig({
 *     rules: {
 *       username: {
 *          required: true
 *       }
 *     },
 *     message: {
 *       username: {
 *           required: 'username为必填号'
 *       }
 *     }
 *  }).init();
 *
 */
class Validate extends Emitter {
    constructor(form, config) {
        super(form, config);
        this.el = form;
        this.errorList = [];
        this.pending = {};
        this.pendingRequest = 0;

        this.config = DEFAULT_CONFIG;
    }

    /**
     * 执行
     */
    run (){
        this.onEvent();
    }
    /**
     * 添加配置
     * @param config
     */
    setConfig (config = {}){
        this.config = $.extend({}, this.config, config);
        return this;
    }
    /**
     * 错误重置
     */
    reset() {
        this.errorList = [];
        this.successList = [];
        this.errorMap = {};
        return this;
    }

    /**
     * 获取错误数量
     * @returns {Number}
     */
    size() {
        return this.errorList.length;
    }

    /**
     * 验证
     * @returns {boolean}
     */
    valid() {
        return this.size() === 0;
    }

    /**
     * 单项检查
     * @param el
     * @returns {boolean}
     */
    check(el) {
        let key = el.data(this.config.validKey);
        let value = this.util.form.elValue(el);
        let rules = this.config.rules[key];

        if(!rules)
            return true;

        // 不存在或者不需要检查的返回true
        if (!el.length || el.data(this.config.ignore))
            return true;

        // 如果是非必填项，而且value是空 直接返回真并且删除log
        if (!rules['required']
            && value === '') {
            return true;
        }

        for (let r in rules) {
            let message = this.config.message[key][r] || __MSG__[key][r];

            let rule = {
                el,
                key,
                method: __METHOD__[r],
                message,
                parameters: rules[r]
            };

            // 没有该方法直接跳过
            if (!rule.method)
                continue;

            let result = rule.method.call(this, value, el, rule);

            // 异步等待
            if (result === 'pending') {
                this.showLog([key], 'pause');
                return;
            }
            // error
            if (!result) {
                this.formatAndAdd(el, rule);
                this.showLog(this.errorList, 'error');
                return false;
            }
        }
        this.successList.push(key);
        this.showLog(this.successList, 'success');
    }

    /**
     * 格式化错误信息
     * @param el
     * @param rule
     */
    formatAndAdd(el, rule) {
        let msg = rule.message;
        let theregex = /\$?\{(\d+)\}/g;

        if (typeof msg === 'function') {
            msg = msg.call(this, rule.parameters, el);
        } else if (theregex.test(msg)) {
            msg = msg.replace(theregex, '{$1}');
            msg = this.util.string.format(msg, rule.parameters);
        }

        this.errorMap[rule.key] = msg;
        this.errorList.push(rule);
    }

    /**
     * 检查全部
     * @returns {*}
     */
    checkAll() {
        this.reset();
        this.util.form.getInps(this.el, (el) => {
            this.check(el);
        });
        return this.valid();
    }

    /**
     * form表单事件绑定
     * @returns {Validate}
     */
    onEvent() {
        this.el.submit(() => {
            // 异步检查是否完成
            if (this.pendingRequest) {
                this.formSubmitted = true;
                return false;
            }

            // 检查所有的表单
            let result = this.checkAll();

            if (!result) {
                return false;
            }

            // 如果结果为true，并且是ajax提交
            if (this.config.ajaxSubmit) {
                this.config.ajaxSubmit.call(this);
                return false;
            }
            return true;
        });
        return this;
    }

    /**
     * 显示log
     * @param list
     * @param type
     */
    showLog(list, type) {
        let config = this.config;

        $.each(list, (i, rule) => {
            let key = rule.key || rule;
            let itemParent = rule.el.parents(config.errorParent);
            itemParent = itemParent.length ? itemParent : rule.el.parent();
            // 获取日志写入节点
            let errMessage = itemParent.find(`[${this.config.validKey}=message]`);
            let message = type === 'error' ? (this.errorMap[key] || rule.message) : __MSG__[key][type];
            message = message || '\n';
            if (!errMessage.length) {
                errMessage = $(config.errorWrap.replace(/{\$\d+}/, message));
                errMessage.attr(this.config.validKey, 'message');
                itemParent.append(errMessage);
            } else {
                errMessage.text(message);
            }
            itemParent.removeClass(`${config.successCls} ${config.focusCls} ${config.errorCls}`).addClass(config[type + 'Cls']);
        });

    }


    previousValue(el) {
        return $.data(el, 'previousValue')
            || $.data(el, 'previousValue', {
                old: null,
                valid: true
            });
    }

    startRequest(key) {
        if (!this.pending[key]) {
            this.pendingRequest++;
            this.pending[key] = true;
        }
    }

    stopRequest(key, valid) {
        this.pendingRequest--;

        if (this.pendingRequest < 0) {
            this.pendingRequest = 0;
        }
        delete this.pending[key];
        if (valid && this.pendingRequest === 0 && this.formSubmitted) {
            this.el.trigger('submit');
            this.formSubmitted = false;
        } else if (!valid && this.pendingRequest === 0 && this.formSubmitted) {
            this.formSubmitted = false;
        }
    }

    /**
     * 设置方法
     * @param name
     * @param fn
     * @param text
     * @param key
     */
    setMethod(name, fn, text, key) {
        if (arguments.length < 2)
            return;

        // 存在的直接覆盖
        __METHOD__[name] = fn;

        if (!text) return;
        __MSG__[key][name] = text;
    }
}

/**
 * 异步验证
 *
 * {
	 * remote: {
	 *      url: 'xxx',
	 *      data: {
	 *          qid: 123
	 *      }
	 *  }
	 * }
 *
 * @param value
 * @param el
 * @param rule
 * @returns {*}
 */
__METHOD__['remote'] = function (value, el, rule) {
    let self = this;
    let config = self.config;
    let fn = config.remoteCallback;

    let previous = self.previousValue(el);

    if (previous.old === value) {
        return previous.valid;
    }
    previous.old = value;

    let param = rule.parameters;
    param = typeof param === 'string' && {url: param} || param;

    self.startRequest(rule.key);

    let data = param.data;

    // 可以通过data传入一个函数
    // data: function(el, value){
    //      return {
    //          a: 123,
    //          b: 456,
    //          c: el.attr('name'),
    //			d: value
    //      }
    // }
    if (typeof data === 'function') {
        data = data(el, value);
    }

    let _this = this;

    this.ajax({
        isNotPop: true,
        url: param.url,
        dataType: 'json',
        data: data,
        success: (json) => {
            let submitted = _this.formSubmitted;
            _this.formSubmitted = submitted;
            _this.successList.push(rule.key);
            _this.showLog(this.successList, 'success');
            fn && fn(json);
            previous.valid = true;
        },
        error: (json) => {
            let msg = json.error || rule.message;
            __MSG__[rule.key]['remote'] = msg;
            rule.message = msg;
            fn && fn(json);
            self.showLog([rule], 'error');
            previous.valid = false;
        },
        done: function (valid) {
            self.stopRequest(rule.key, valid);
        }
    });

    return 'pending';
};
/**
 * 是否必填
 * @param value
 * @param el
 * @returns {boolean}
 */
__METHOD__['required'] = function (value, el) {
    if (el[0].nodeName.toLowerCase() === 'select') {
        let v = el[0].value;
        if (v === '0') return true;
        return !!v;
    }
    if (this.util.form.checkable(el)) {
        return this.util.form.getLength(el) > 0;
    }
    return $.trim(value).length > 0;
};

/**
 * 相等
 * @param value
 * @param el
 * @param rule
 * @returns {boolean}
 */
__METHOD__['equalTo'] = function (value, el, rule) {
    let self = this;
    let target = self.nodes_cache[rule.parameters];
    if (!target) return true;
    return value === this.util.form.elValue(target);
};
/**
 * 不等
 * @param value
 * @param el
 * @param rule
 * @returns {boolean}
 */
__METHOD__['unequal'] = function (value, el, rule) {
    let self = this;
    let target = self.nodes_cache[rule.parameters];
    if (!target) return true;
    return value !== this.util.form.elValue(target);
};

/**
 * 范围
 * [5, 8]
 * @param value
 * @param el
 * @param rule
 * @returns {boolean}
 */
__METHOD__['range'] = function (value, el, rule) {
    let param = rule.parameters;
    let len = value.length;
    return len >= param[0] && len <= param[1];
};

export default Validate;