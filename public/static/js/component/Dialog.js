/**
 * Created by lidongyue on 2015/11/23.
 */
import Emitter from '../lib/emitter';

const DEFAULT_CONFIG = {
    //标题
    title: 'dialog',
    //内容
    content: `<i></i><h2>弹层test</h2><p>fsfsafsfsafsafsafds</p>`,
    //按钮
    btns: [
        {
            id: 'ok', value: '确定', callback: () => {
        }
        },
        {
            id: 'cancel', value: '取消', callback: () => {
        }
        }
    ],
    // 事件
    eventType: 'click',
    skin: 'ui-dialog',
    //模板
    template: `
        <div class="tc-dialog-overlay <%=skin%>"></div>
        <div class="tc-dialog <%=skin%>">
            <h2><%= title %></h2>
            <span class="tc-dialog-setwin">
                <a class="tc-dialog-close"></a>
            </span>
            <div class="tc-dialog-content">
                <%= content %>
            </div>
            <div class="tc-dialog-btn">
                <% for(var i=0, len=btns.length; i<len; i++) {%>
                    <a id="<%=btns[i].value%>" class="tc-dialog-btn<%= i %>"><%=btns[i]['value']%></a>
                <% }; %>
            </div>
        </div>
    `
};

class Dialog extends Emitter {
    constructor() {
        super();
        this.config = DEFAULT_CONFIG;
        this.open = false;
    }

    /**运行*/
    init() {
        if (!this.dialog) {
            this.createTmp(this.config);
        } else {
            this.show();
        }
        this.position();
        this.open = true;
        this.onEvent();
    }

    /**配置*/
    setConfig(config = {}) {
        this.config = $.extend({}, this.config, config);
        return this;
    }

    /**生成模板*/
    createTmp(data) {
        let html = this.tpl(this.config.template, data);
        let dialog = this.dialog = $(html);
        $('body').append(dialog);
        return this;
    }

    /**绑定事件*/
    onEvent() {
        //关闭
        this.dialog.on('click', '.tc-dialog-close', () => {
            this.hide();
            return false;
        });
        //button
        this.dialog.on(this.config.eventType, '.tc-dialog-btn a', (event) => {
            let $this = $(event.target);
            let index = $this.index();

            let btnObj = this.config.btns[index];
            if ((btnObj && btnObj['callback']) && typeof btnObj['callback'] === 'function') {
                btnObj['callback'].call(this, $this);
            }
            return false;
        });
    }

    /**显示*/
    show() {
        if (!this.open) {
            $(this.dialog).find('.tc-dialog-overlay').removeClass(`${this.config.skin}-hide`).addClass(`${this.config.skin}-show`);
            $(this.dialog).find('.tc-dialog').removeClass(`${this.config.skin}-hide`).addClass(`${this.config.skin}-show`);
            this.open = true;
        }
        return this;
    }

    /**隐藏*/
    hide() {
        if (this.open) {
            $(this.dialog).find('.tc-dialog-overlay').removeClass(`${this.config.skin}-show`).addClass(`${this.config.skin}-hide`);
            $(this.dialog).find('.tc-dialog').removeClass(`${this.config.skin}-show`).addClass(`${this.config.skin}-hide`);
            this.open = false;
        }
        return this;
    }

    //**移除事件*/
    /**移除*/
    remove() {
        $($('body').find('.tc-dialog-overlay')).remove();
        $($('body').find('.tc-dialog')).remove();
        this.dialog = null;
        this.open = false;
        return this;
    }

    /**位置*/
    position() {
        debugger;
        if (this.dialog) {
            /**get obj*/
            let task = $(this.dialog).find('.tc-dialog');
            let overlay = $(this.dialog).find('.tc-dialog-overlay');

            /**遮罩层css*/
            let cssOverlay = {
                position: 'fixed',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                zIndex: 10000,
                backgroundColor: '#000',
                opacity: .3
            };
            /**弹层css*/
            let cssDialog = {
                position: 'fixed',
                top: '50%',
                left: '50%',
                padding: 0,
                minWidth: '340px',
                textAlign: 'center',
                borderRadius: '5px',
                backgroundColor: '#fff',
                backgroundClip: 'content-box',
                animationFillMode: 'both',
                animationDuration: '.3s',
                overflow: 'hidden',
                zIndex: 10001
            };

            /**根据浏览器调整遮罩层css*/
            let taskH = task.clientHeight();
            let taskP = 0;
            if (typeof getComputedStyle !== 'undefined') {
                taskP = parseInt(getComputedStyle(task).getPropertyValue('padding-top'), 10);
            } else {
                taskP = parseInt(task.currentStyle.padding);
            }
            let taskMarginTop = `${parseInt((taskH + taskP) / 2)}px`;

            $.extend(cssOverlay, {
                position: 'absolute',
                width: `${$(window).width()}px`,
                height: `${$(window).height()}px`
            });

            $.extend(cssDialog, {
                marginTop: taskMarginTop
            });

            /**应用css*/
            overlay.css(cssOverlay).addClass(`${this.config.skin}-show`);
            task.css(cssDialog).addClass(`${this.config.skin}-show`);
        }
        return this;
    }
}
// new Dailog().setConfig().run();
export default Dialog;