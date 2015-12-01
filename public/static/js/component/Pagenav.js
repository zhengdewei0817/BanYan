/**
 * @author Charles TCZC
 *
 * @example
 *
 * <div id="pageBox">
 * </div>
 *
 *
 *	new Pagenav(''#pageBox').setConfig({
 *		childNode: 'a',
 *		currClass: 'active',
 *		defPage: 2,
 *	    total: 5,
 *	    onAfter: ()=> {this.debug(this.current)}
 *	}).run();
 *
 */
import Emitter from '../lib/emitter';

const DEFAULT = {
    html: `<% for(var i=0; i<list.length; i++){ %><a href="javascript:;" target="_self" class="<%= list[i].cls %>"><%= list[i].text %></a><%}%>`,
    // 子节点标签名，用来绑定事件
    childNode: 'a',
    // 选择样式
    currClass: 'active',
    // 默认分页数
    defPage: 1,
    // 总共分几页
    total: 5,
    onAfter: () => {}
};

class Pagenav extends Emitter{
    constructor(el){
        super(el);
        this.el = $(el);
        this.config = DEFAULT;
        this.el.off('click');

        this.events[`${this.config.childNode} click`] = 'tabPage';
    }

    /**
     * 初始化
     */
    init() {
        this.current = this.config.defPage;
        this.creatTags(this.current);
    }
    /**
     * 配置
     * @param config
     * @returns {Pagenav}
     */
    setConfig(config) {
        this.config = $.extend({}, DEFAULT, config);
        return this;
    }

    /**
     * 生成标签
     * @param index
     * @returns {*}
     */
    creatTags(index){
        index = index | 0;
        let config = this.config;
        let total = config.total | 0;
        //let tags = config.tags;
        let page = total > 100 ? 2 : 4;
        let len = index + page > total ? total : index + page;
        let i = index - page < 1 ? 1 : index - page;

        // 只有一页不显示
        if(total === 1)
            return this.el.html('');

        let list = [];
        // 上一页
        if(index > 1){
            list.push({
                cls: 'prev',
                text: '\u4e0a\u4e00\u9875'
            });
        }

        if(index - page >= 2){
            list.push({
                cls: '',
                text: 1
            });
            if(index - page !== 2){
                list.push({
                    cls: 'no',
                    text: '...'
                });
            }
        }

        // 遍历分页
        for(; i<=len; i++){
            let cls = '';
            if(i === index){
                cls = config.currClass;
            }
            list.push({
                cls: cls,
                text: i
            });
        }

        if(index + page <= total - 1){
            if(index + page !== total - 1){
                list.push({
                    cls: 'no',
                    text: '...'
                });
            }
            list.push({
                cls: '',
                text: total
            });
        }

        // 下一页
        if(index !== total){
            list.push({
                cls: 'next',
                text: '\u4e0b\u4e00\u9875'
            });
        }

        let result = this.tpl(config.html, {
            list: list
        });

        this.el.html(result);
    }

    /**
     * 切换分页
     * @param evt
     * @returns {index}
     */
    tabPage(evt) {
        const $this = $(evt.target);
        let index = this.getIndex($this);
        if (isNaN(index) || this.current === index) {
            return index;
        }
        this.current = index;
        this.creatTags(index);
        this.config.onAfter.call(this);
    }

    /**
     * 获取当前分页数
     * @param obj
     * @returns {*}
     */
    getIndex(obj){
        let index = this.current;
        if (obj.hasClass('next')) {
            index++;
            if (index > this.config.total) {
                return 'next';
            }
        } else if (obj.hasClass('prev')) {
            index--;
            if (index < 1) {
                return 'prev';
            }
        } else {
            index = obj.text();
        }
        return parseInt(index);
    }

}

export default Pagenav;