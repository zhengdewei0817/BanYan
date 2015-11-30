/**
 * @author TCZC
 *
 * @example
 *
 * <button class="btn">loading</button>
 *
 * $('.btn').on('click', () => {
 *     loading(`<div class="img"></div><p>加载中……</p>`,2);
 * });
 *
 * loading
 * @param message 显示信息
 * @param time 自动关闭时间(s) 0为不自动关闭
 */
import Dialog from '../component/Dialog';
function loading (message, time) {
    time = parseInt(time * 1000);
    return new Dialog().setConfig({
        type: 'loading',
        content: message,
        showHead: false,
        showBtn: false,
        overlay: true,
        showSharp: true,
        autoClose: time,
        skin: `tc-dialog-loading`
    }).init();
}

export default loading;
