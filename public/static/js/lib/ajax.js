/**
 * ajax
 * 通过和服务端的协议，errno == 0 => success
 * @param options
 */
export default function (options) {
    $.ajax(options || {}).success(res => {
        if (res.errno === 0) {
            options.success && options.success(res);
        } else {
            options.error && options.error(res);
        }
        options.done && options.done(res);
    });
}