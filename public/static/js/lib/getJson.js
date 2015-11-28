/**
 * ajax
 * 通过和服务端的协议，errno == 0 => success
 * @param options
 */
export default function (options) {
    return new Promise((resolve, reject) => {
        $.ajax(options || {}).success(res => {
            if (res.errno === 0) {
                resolve(res);
            } else {
                reject(res);
            }
        });
    });
}