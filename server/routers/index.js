var Router = require('express').Router;
var requestApi = require('../libs/requestApi').api;

var api = ENV_CONFIG.api;

var indexRouter = Router();

indexRouter.get('/', (req, res, next) => {

    var request = requestApi(req);

    request({
        api: api.pc,
        url: 'model/',
        data: {
            id: '1'
        }
    }).then(function(data){
        res.render('index', {
            title: 'liluo.me'
        });
    });
});

module.exports = indexRouter;