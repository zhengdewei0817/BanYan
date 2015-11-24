/**
 * @author Charles TCZC
 *
 * @example
 *
 * <div class="tc-tab">
 * 		<div class="tab-item">tab1</div>
 * 		<div class="tab-item">tab2</div>
 * 		<div class="tab-item">tab3</div>
 * </div>
 *
 * <div class="tc-tab-content">tab1 content</div>
 * <div class="tc-tab-content">tab2 content</div>
 * <div class="tc-tab-content">tab3 content</div>
 *
 *
 *	new Tab('.tc-tab', {
 *		childNode: '.tab-item',
 *		contentNode: '.tc-tab-content',
 *		isSingleContent: false
 *	})
 * 
 */

import Emitter from '../lib/emitter';

const DEFABULT = {
    childNode: '.tab-item',
    contentNode: 'tc-tab-content',
    active: 1,
    eventType: 'click',
    activeClass: 'active',
    renderType: 'not'
};

class Tab extends Emitter {
    constructor (el, config){
        super(el, config);
        this.el = el;
        this.config = config;
    }

    run (){
        this.onEvent();
    }
    /**
     * 配置
     * @param {Object} config 传入配置
     */
    setConfig (config = {}){
        this.config = $.extend({}, this.config, config);
        return this;
    }

    /**
     * 渲染模板
     * 如果 config.render == tpl时，请选择重写该方法
     * @param el        点击的元素
     * @returns {string}
     */
    setTplRender (el){
        return ''
    }

    /**
     * 事件绑定
     */
    onEvent (){
        $(this.el).on(this.config.eventType, this.config.childNode, (evt) => {
            let $this = $(evt.target);
            let index = $this.index();
            // 样式切换
            $this.addClass(this.config.activeClass).siblings(this.config.childNode).removeClass(this.config.activeClass);
            // 根据不同的类型切换渲染的方式
            switch (this.config.render){
                case 'tpl':
                    let html = this.setTplRender.call(this, $this);
                    $(this.config.contentNode).html(html);
                    break;
                default :
                    $(`${this.config.contentNode}:eq(${index})`).addClass('show').siblings(this.config.contentNode).addClass('hide');
            }
            // 内容切换
        });
        // 默认选中
        $(`${this.config.childNode}:eq(${this.config.active - 1})`).trigger(this.config.eventType);
    }
}

export default Tab;