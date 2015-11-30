/**
 * @author TCZC
 *
 * @example
 *
 * <button class="btn">confirm</button>
 *
 *$('.btn').on('click', () => {confirm(`警告：您确定时间是20151128？`, function () {alert(9);});});
 *
 * @param message 显示信息
 * @param okCall 确定按钮的回调
 * @param cancelCall 取消按钮的回调
 */
import Dialog from '../component/Dialog';
function confirm(message, okCall = () => {
}, cancelCall = () => {
}) {
    return new Dialog().setConfig({
        type: 'confirm',
        title: '信息确认',
        content: message,
        btns: [{
            id: 'ok', value: '确定', callback: () => {
                okCall();
            }
        }, {
            id: 'cancel', value: '取消', callback: () => {
                cancelCall();
            }
        }],
        showHead: true,
        showBtn: true,
        overlay: true,
        skin: `tc-dialog-alert`
    }).init();
}

export default  confirm;