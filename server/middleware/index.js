var parameterCheck = require('../config/parameter');
var utils = require('../libs/utils');

exports.parameter = (req, res, next) => {
    var data = req.method == 'GET' ? req.query : req.body;
    //
    for(var key in data){
        var rule = parameterCheck[key];
        if(rule && rule.test(data[key]) === true){
            data[key] = data[key].replace(rule, '');
        }
    }
    next();
};