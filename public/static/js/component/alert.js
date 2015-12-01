/**
 * @author TCZC
 *
 * @example
 *
 * <button class="btn">alert</button>
 *
 * $('.btn').on('click', () => {
 *     alert(`弹出了一个alert`);
 * });
 *
 * @param message 显示信息
 */

import Dialog from '../component/Dialog';
function alert(message) {
    return new Dialog().setConfig({
        type: 'alert',
        title: `提示信息`,
        content: message,
        showHead: true,
        showBtn: true,
        overlay: true,
        skin: `tc-dialog-alert`
    }).init();
}

export default alert;