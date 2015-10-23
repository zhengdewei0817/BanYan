import request from 'request';

import Logger from './logger';
import utils from './utils';
import ErrorModal from './errorModal';

let logger = Logger.log('request');
/**
 * json转query
 * @param object
 * @returns {string}
 */
function json2str(object){
    let array = [];
    for(var key in object){
        if ( !!object[key] || object[key] === 0 ) {
            array.push( key + '=' + object[key] );
        }
    }
    return array.join('&');
}

export function api(req){
    return (options) => {
        let promise = new Promise((resolve, reject) => {
            var ip = utils.getClientIp(req);
            var method = options.method || 'POST';
            var url = (options.api || '') + options.url;
            logger.info(ip, url, method, options.form ? 'form' : 'json', JSON.stringify(options.data));

            var param = {
                method: method.toUpperCase(),
                uri: url
            };

            if(options.contentTypeFrom){
                param.form = options.data;
            } else {
                param.json = options.data;
            }

            request(param, (err, request, body) => {
                var _data;
                if (err) {
                    _data = ErrorModal['ERR_SYSTEM_ERROR'];
                    logger.error(options.url, ip, err);
                    resolve(_data);
                    //reject(err);
                    return ;
                }

                try {
                    _data = typeof body == 'string' ? JSON.parse(body) : body;
                } catch (e) {
                    logger.info(options.url, ip, JSON.stringify(body));
                    _data = ErrorModal['ERR_SYSTEM_ERROR'];
                }

                logger.info(options.url, ip, JSON.stringify(_data));
                resolve(_data);
            });
        });

        return promise;
    }
}