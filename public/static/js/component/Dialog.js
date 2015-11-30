/**
 * @author TCZC
 *
 * @example
 *
 * <button class="btn">Alert</button>
 *$('.btn').on('click', () => {
 *    new Dialog().setConfig({
 *        title: '提示信息',
 *        content: `<i></i><h4>网页对话框组件</h4><p>欢迎使用对话框组件</p>`,
 *       btns: [{
 *            id: 'an1', value: '按钮一', callback: () => {
 *                alert(`i am anniu1`);
 *            }
 *        }, {
 *            id: 'an2', value: '按钮二', callback: () => {
 *                alert(`i am anniu2`);
 *            }
 *        }, {
 *            id: 'an2', value: '按钮三', callback: () => {
 *                alert(`i am anniu3`);
 *            }
 *        }, {
 *            id: 'an2', value: '按钮四', callback: () => {
 *                alert(`i am anniu4`);
 *            }
 *       }]
 *   *}).init();
 *});
 *
 */
import Emitter from '../lib/emitter';
let __METHOD__ = {dialogZone: []};
const DEFAULT_CONFIG = {
    type: 'dialog',
    /**标题*/
    title: 'dialog',
    /**内容 innerHtml*/
    content: `<i></i><h2>弹层test</h2><p>fsfsafsfsafsafsafds</p>`,
    /**按钮 默认只有一个close*/
    btns: [{
        id: 'Close', value: '确定', callback: () => {
        }
    }],
    /**显示弹层的尖角(小三角)*/
    showSharp: false,
    sharp: '',
    /**显示标题栏*/
    showHead: true,
    /**显示按钮拦*/
    showBtn: true,
    /**是否显示遮罩层*/
    overlay: true,
    /**事件类型*/
    eventType: 'click',
    /**用户自定义样式*/
    skin: 'default',
    /**定位弹层位置所参照的目标对象*/
    tipsTarget: null,
    /**位置 用1,2,3,4分别代表目标位置上右下左侧*/
    tipsPosition: 1,
    /**自动关闭时间*/
    autoClose: 0,
    /**模板*/
    template: `
        <div class="tc-dialog tc-dialog-hide">
            <div class="sharp tips-out-<%= tipsPosition %>"><%= sharp %></div>
            <div class="sharp tips-in-<%= tipsPosition %>"><%= sharp %></div>
            <div class="tc-dialog-head">
                <span><%= title %></span>
                <span class="tc-dialog-setwin">
                <a class="tc-dialog-close">×</a>
                </span>
            </div>
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
        this.createTmp(this.config);
        this.position();
        this.show();
        this.onEvent();
    }

    /**配置*/
    setConfig(config = {}) {
        this.config = $.extend({}, this.config, config);
        return this;
    }

    /**生成*/
    createTmp(data) {
        let dialogObj = __METHOD__.dialogZone.length > 0 ? __METHOD__.dialogZone[__METHOD__.dialogZone.length - 1] : undefined;
        if (dialogObj && dialogObj.config.type === this.config.type && !this.config.showSharp) {
            let dialogObj = __METHOD__.dialogZone[__METHOD__.dialogZone.length - 1];
            [this.dialog,this.dialog_head,this.dialog_content,this.dialog_btn] = [dialogObj.dialog, dialogObj.dialog_head, dialogObj.dialog_content, dialogObj.dialog_btn];
            /**移除原有skin*/
            this.dialog.removeClass(dialogObj.config.skin);
            /**重新填充内容*/
            this.dialog_content.html(``).append(this.config.content);
        } else {
            this.removeAll();
            let html = this.tpl(this.config.template, data);
            this.dialog = $(html);
            this.dialog_head = this.dialog.children('.tc-dialog-head');
            this.dialog_content = this.dialog.children('.tc-dialog-content');
            this.dialog_btn = this.dialog.children('.tc-dialog-btn');
        }
        this.dialog.addClass(this.config.skin);
        if (!$('body').find('.tc-dialog').length) {
            $('body').append(this.dialog);
        }
        //遮罩层
        if (this.config.overlay) {
            if (!this.overlay) {
                this.overlay = $('<div class="tc-dialog-overlay"></div>');
                this.overlay.insertBefore(this.dialog);
            }
            this.overlay.removeClass(`tc-dialog-hide`);
        }
        return this;
    }

    /**绑定事件*/
    onEvent() {
        /**浏览器调整宽高*/
        $(window).on('resize', () => {
            this.position();
        });
        /**×关闭*/
        this.dialog.on('click', '.tc-dialog-close', () => {
            this.remove();
            return false;
        });
        /**按钮组*/
        this.dialog.on(this.config.eventType, '.tc-dialog-btn a', (event) => {
            let $this = $(event.target);
            let index = $this.index();

            this.close();
            this.config.btns[index] && this.config.btns[index]['callback'].call(this, $this);
            return false;
        });
    }

    close() {
        if (this.open) {
            this.dialog.addClass(`tc-dialog-hide`).removeClass(this.config.skin);
            if (this.overlay) {
                this.overlay.addClass(`tc-dialog-hide`);
            }
            this.dialog.children().removeClass(`tc-dialog-hide`);
            this.dialog_content.children().remove();
            this.open = false;
        }
        return this;
    }

    /**显示*/
    show() {
        if (!this.open) {
            if (this.config.type !== 'tips') {
                this.dialog.find('.tips-out').addClass(`tc-dialog-hide`);
                this.dialog.find('.tips-in').addClass(`tc-dialog-hide`);
            }
            if (!this.config.showHead) {
                this.dialog_head.addClass(`tc-dialog-hide`);
            }
            if (!this.config.showBtn) {
                this.dialog_btn.addClass(`tc-dialog-hide`);
            }
            this.dialog.removeClass(`tc-dialog-hide`);
            if (this.config.autoClose && this.config.autoClose > 0) {
                this.autoClose();
            }
            this.open = true;
            __METHOD__.dialogZone.push(this);
        }
        return this;
    }

    /**自动关闭*/
    autoClose() {
        if (this._closeTimeout) {
            clearTimeout(this._closeTimeout);
        }
        this._closeTimeout = setTimeout(() => {
            this.close();
        }, this.config.autoClose);
        return this;
    }

    /**移除*/
    remove() {
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
        this.dialog.remove();
        this.dialog = null;
        this.open = false;
        __METHOD__.dialogZone.splice(0, __METHOD__.dialogZone.length);
        return this;
    }

    /**移除所有已经存在的dialog*/
    removeAll() {
        $('body').find('.tc-dialog').remove();
        $('body').find('.tc-dialog-overlay').remove();
        __METHOD__.dialogZone.splice(0, __METHOD__.dialogZone.length);
    }

    /**位置*/
    position() {
        if (this.dialog) {
            let rleft = `0px`;
            let rtop = `0px`;
            if (this.config.tipsTarget !== null) {
                /**目标对象的left、top、width、height*/
                let tl = this.config.tipsTarget.offset().left;
                let tt = this.config.tipsTarget.offset().top;
                let tw = this.config.tipsTarget.width();
                let th = this.config.tipsTarget.height();
                /**tips的width、height*/
                let tipsw = this.dialog.width();
                let tipsh = parseInt(this.dialog.height() / 2);
                switch (this.config.tipsPosition) {
                    case 1:
                        /**top*/
                        rleft = `${parseInt(tl + 20)}px`;
                        rtop = `${parseInt(tt - tipsh + 5)}px`;
                        break;
                    case 2:
                        /**right*/
                        rleft = `${parseInt(tl + tw + 20)}px`;
                        rtop = `${parseInt(tt - 15)}px`;
                        break;
                    case 3:
                        /**bottom*/
                        rleft = `${parseInt(tl + 20)}px`;
                        rtop = `${parseInt(tt + th + 15)}px`;
                        break;
                    case 4:
                        /**left*/
                        rleft = `${parseInt(tl - tipsw - 25)}px`;
                        rtop = `${parseInt(tt - 10)}px`;
                        break;
                }
            } else {
                /**居中*/
                let ww = $(window).width();
                let wh = $(window).height();
                let ow = this.dialog.width();
                let oh = this.dialog.height();

                rleft = `${parseInt((ww - ow) / 2)}px`;
                rtop = `${parseInt((wh - oh) / 2)}px`;
            }
            this.dialog.css({'left': rleft, 'top': rtop});
        }
        return this;
    }
}
export default Dialog;