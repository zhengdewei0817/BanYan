/**
 * ajax
 * 通过和服务端的协议，errno == 0 => success
 * @param options
 */
export default function (options) {
    $.ajax(options || {}).success(res => {
        if (res.errno === 0) {
            return options.success && options.success(res);
        }
        return options.error && options.error(res);
    });
}