import Dialog from '../component/Dialog';
import alert from '../component/alert';
import confirm from '../component/confirm';
import tips from '../component/tips';
import loading from '../component/loading';
import '../../less/dialog/dialog.less';

$('.dialog-html-main').on('click', '.btn', (event) => {
    let $this = $(event.target);
    switch ($this.text()) {
        case 'Dialog':
            new Dialog().setConfig({
                title: '提示信息',
                content: `<i></i><h4>网页对话框组件</h4><p>欢迎使用对话框组件</p>`,
                btns: [{
                    id: 'an1', value: '按钮一', callback: () => {
                        alert(`i am anniu1`);
                    }
                }, {
                    id: 'an2', value: '按钮二', callback: () => {
                        alert(`i am anniu2`);
                    }
                }, {
                    id: 'an2', value: '按钮三', callback: () => {
                        alert(`i am anniu3`);
                    }
                }, {
                    id: 'an2', value: '按钮四', callback: () => {
                        alert(`i am anniu4`);
                    }
                }]
            }).init();
            break;
        case 'Alert':
            alert(`弹出了一个alert`);
            break;
        case 'Confirm':
            confirm(`警告：您确定时间是20151128？`, function () {
                alert(9);
            });
            break;
        case 'Tips':
            let $this = $(event.target);
            switch ($this.attr('id')) {
                case 'tips':
                    tips($this, 1, `i am tips`, 1);
                    break;
                case 'tips2':
                    tips($this, 2, `i am tips`, 1);
                    break;
                case 'tips3':
                    tips($this, 3, `i am tips`, 1);
                    break;
                case 'tips4':
                    tips($this, 4, `i am tips`, 1);
                    break;
            }
            break;
        case 'Loading':
            loading(`<div class="img"></div><p>加载中……</p>`, 2);
            break;
    }
});




