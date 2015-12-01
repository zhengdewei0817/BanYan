/**
 * 远程获取json数据
 * 通过和服务端的协议，errno == 0 => success
 * @param options
 * @returns {Promise}
 */
export default function (options = {}) {
    return new Promise((resolve, reject) => {
        options.dataType = options.dataType || 'json';
        $.ajax(options).success(res => {
            if (res.errno === 0) {
                resolve(res);
            } else {
                reject(res);
            }
        });
    });
}