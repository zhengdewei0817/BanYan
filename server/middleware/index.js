import parameterCheck from '../config/parameter';
import utils from '../libs/utils';

export function parameter(req, res, next){
    let data = req.method == 'GET' ? req.query : req.body;

    //
    for(let key in data){
        let rule = parameterCheck[key];
        if(rule && rule.test(data[key]) === false){
            data[key]
        }
    }

    next();
}