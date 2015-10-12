import request from 'request';

import Logger from './logger';
import utils from './utils';

let logger = Logger.log('request');


export function api(req){
    return (options) => {
        let promise = new Promise((resolve, reject) => {
            var ip = utils.getClientIp(req);
            //options = sign.make(options, req);
            var method = options.method || 'POST';
            var url = (options.api || '') + options.url;
            logger.info(ip, url, method, JSON.stringify(options.data));

            request({
                method: method.toUpperCase(),
                uri: url,
                json: options.data
            }, (err, request, body) => {
                var _data;
                if (err) {
                    _data = error['SERVICE_URL'];
                    logger.error(options.url, ip, err);
                    resolve(_data);
                    //reject(err);
                    return ;
                }

                try {
                    _data = typeof body == 'string' ? JSON.parse(body) : body;
                } catch (e) {
                    logger.info(options.url, ip, JSON.stringify(body));
                    _data = error['SERVICE'];
                }

                logger.info(options.url, ip, JSON.stringify(_data));
                resolve(_data);
            });
        });

        return promise;
    }
}