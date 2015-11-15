var crypto = require('crypto');

function randomNum(m, n){
    return Math.random()*(n-m)+m
}
/**
 * 简单的对象继承
 * @param old
 * @param n
 * @returns {*}
 */
exports.extend = (old, n) => {
    for (var key in n) {
        old[key] = n[key];
    }
    return old;
};
/**
 * 获取客户端IP
 * @param req
 * @returns {*|string}
 */
exports.getClientIp = (req) => {
    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    return ip;
};
exports.md5 = (str) => {
    var buf = new Buffer(str);
    var str = buf.toString("binary");
    return crypto.createHash("md5").update(str).digest("hex");
};
exports.getRandomNum = () => {
    var arr = [];
    for(var i=0; i<4; i++){
        arr.push(parseInt(randomNum(1, 9)));
    }
    return arr.join('');
};