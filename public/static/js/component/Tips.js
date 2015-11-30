/**
 * @author TCZC
 *
 * @example
 *
 * <button class="btn">tips</button>
 *
 * $('.btn').on('click', (event) => {
 *     let $this = $(event.target);
 *     tips($this,1,`i am tips`,1);
 * });
 *
 * tips
 * @param target 目标对象
 * @param position 方位 用1,2,3,4分别代表目标位置上右下左侧
 * @param message 显示信息
 * @param time 自动关闭时间(s)  0为不自动关闭
 */
import Dialog from '../component/Dialog';
function tips (target,position, message, time) {
    time = parseInt(time * 1000);
    let sharpPosition = ``;
    switch (position){
        case 1:
            sharpPosition = `▼`;
            break;
        case 2:
            sharpPosition = `◄`;
            break;
        case 3:
            sharpPosition = `▲`;
            break;
        case 4:
            sharpPosition = `►`;
            break;
    }
    return new Dialog().setConfig({
        type: 'tips',
        content: message,
        showHead: false,
        showBtn: false,
        overlay: false,
        showSharp: true,
        tipsTarget: target,
        tipsPosition: position,
        autoClose: time,
        skin: `tc-dialog-tips`,
        sharp: sharpPosition
    }).init();
}

export default tips;