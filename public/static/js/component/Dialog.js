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
const DEFAULT_CONFIG = {
    type: 'dialog',
    // 标题
    title: '',
    // 内容 innerHtml
    content: '',
    // 按钮 默认只有一个close
    btns: [],
    //显示弹层的尖角(小三角)
    showSharp: false,
    sharp: '',
    // 显示标题栏
    showHead: true,
    // 显示按钮拦
    showBtn: true,
    // 是否显示遮罩层
    overlay: true,
    // 事件类型
    eventType: 'click',
    // 用户自定义样式
    skin: 'default',
    // 定位弹层位置所参照的目标对象
    tipsTarget: null,
    // 位置 用1,2,3,4分别代表目标位置上右下左侧
    tipsPosition: 0,
    //自动关闭时间
    autoClose: 0,
    // 是否允许叠加
    superposition: false,
    //模板
    template: `
        <div class="tc-dialog hide">
            <%if(tipsPosition){%>
            <div class="sharp tips-out-<%= tipsPosition %>"><%= sharp %></div>
            <div class="sharp tips-in-<%= tipsPosition %>"><%= sharp %></div>
            <%}%>
            <div class="tc-dialog-head">
                <%if(title){%>
                <span><%= title %></span>
                <%}%>
            </div>
            <div class="tc-dialog-content">
                <%= content %>
            </div>
            <%var len=btns.length;%>
            <%if(len){%>
            <div class="tc-dialog-btn">
                <% for(var i=0; i<len; i++) {%>
                    <a id="<%=btns[i].value%>" class="tc-dialog-btn<%= i %>"><%=btns[i]['value']%></a>
                <% }; %>
            </div>
            <% }; %>
            <a class="tc-dialog-close">×</a>
        </div>
    `
};

const $body = $('body');
let $overlay = null;

class Dialog extends Emitter {
    constructor() {
        super();
        this.config = DEFAULT_CONFIG;
        this.isOpen = false;
    }

    // 初始化
    init() {
        // 如果不允许叠加，默认全部删除
        if(!this.config.superposition){
            this.removeAll();
        }
        this.createDialog();
        this.creatOverlay();
        this.position();
        this.show();
        this.onEvent();
    }

    // 配置
    setConfig(config = {}) {
        this.config = $.extend({}, this.config, config);
        return this;
    }

    /**
     * 生成弹出层
     * @returns {Dialog}
     */
    createDialog() {
        let html = this.tpl(this.config.template, this.config);
        this.dialog = $(html);
        $body.append(this.dialog);
        return this;
    }

    /**
     * 生成遮罩层
     * @returns {Dialog}
     */
    creatOverlay() {
        if (this.config.overlay) {
            // 如果已经有一个遮罩层，不允许再存在
            if($overlay){
                return this;
            }
            $overlay = $('<div class="tc-dialog-overlay"></div>');
            $overlay.insertBefore(this.dialog);
        }
        return this;
    }

    //绑定事件
    onEvent() {
        //浏览器调整宽高
        $(window).on('resize', () => {
            this.position();
        });
        //×关闭
        this.dialog.on('click', '.tc-dialog-close', () => {
            this.remove();
            return false;
        });
        //按钮组
        this.dialog.on(this.config.eventType, '.tc-dialog-btn a', (event) => {
            let $this = $(event.target);
            let index = $this.index();

            this.close();
            this.config.btns[index] && this.config.btns[index]['callback'].call(this, $this);
            return false;
        });
    }

    //显示
    show() {
        if (!this.isOpen) {
            this.dialog.addClass(`${this.config.skin}`).removeClass(`hide`);
            if ($overlay) {
                $overlay.removeClass(`hide`);
            }
            if (this.config.autoClose && this.config.autoClose > 0) {
                this.autoClose();
            }
            this.isOpen = true;
        }
        return this;
    }

    /**
     * 自动关闭
     * @returns {Dialog}
     */
    autoClose() {
        if (this._closeTimeout) {
            clearTimeout(this._closeTimeout);
        }
        this._closeTimeout = setTimeout(() => {
            this.close();
        }, this.config.autoClose);
        return this;
    }
    /**
     * 关闭弹出层
     * @returns {Dialog}
     */
    close() {
        if (this.isOpen) {
            this.dialog.addClass(`hide`).removeClass(`${this.config.skin}`);
            if ($overlay) {
                $overlay.addClass(`hide`);
            }
            this.isOpen = false;
        }
        return this;
    }
    /**
     * 移除
     * @returns {Dialog}
     */
    remove() {
        this.removeOverlay();
        this.dialog.off().remove();
        this.isOpen = false;
        return this;
    }

    /**
     * 删除遮罩层
     * @returns {Dialog}
     */
    removeOverlay() {
        if ($overlay) {
            $overlay.remove();
            $overlay = null;
        }
        return this;
    }

    /**
     * 移除所有已经存在的dialog
     * @returns {Dialog}
     */
    removeAll() {
        $overlay = null;
        $body.find('.tc-dialog').remove();
        $body.find('.tc-dialog-overlay').remove();
        return this;
    }

    //位置
    position() {
        if (this.dialog) {
            let rleft = `0px`;
            let rtop = `0px`;
            if (this.config.tipsTarget !== null) {
                //目标对象的left、top、width、height
                let tl = this.config.tipsTarget.offset().left;
                let tt = this.config.tipsTarget.offset().top;
                let tw = this.config.tipsTarget.width();
                let th = this.config.tipsTarget.height();
                //tips的width、height
                let tipsw = this.dialog.width() - this.dialog.find('.tc-dialog-content').width();
                let tipsh = this.dialog.height();
                switch (this.config.tipsPosition) {
                    case 1:
                        //top
                        rleft = `${parseInt(tl + 20)}px`;
                        rtop = `${parseInt(tt - tipsh + 10)}px`;
                        break;
                    case 2:
                        //right
                        rleft = `${parseInt(tl + tw + 20)}px`;
                        rtop = `${parseInt(tt - 15)}px`;
                        break;
                    case 3:
                        //bottom
                        rleft = `${parseInt(tl + 20)}px`;
                        rtop = `${parseInt(tt + th + 15)}px`;
                        break;
                    case 4:
                        //left
                        rleft = `${parseInt(tl - tipsw + 10)}px`;
                        rtop = `${parseInt(tt - 10)}px`;
                        break;
                }
            } else {
                //居中
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