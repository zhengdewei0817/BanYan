let utils = {
    /**
     * 获取客户端IP
     * @param req
     * @returns {*|string}
     */
    getClientIp: (req) => {
        var ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        return ip;
    }
};

export default utils;