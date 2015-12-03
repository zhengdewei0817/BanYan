var Router = require('express').Router;
var requestApi = require('../libs/requestApi').api;

var api = ENV_CONFIG.api;

var indexRouter = Router();

indexRouter.get('/', (req, res, next) => {
    res.render('index', {
        abc: 'hello world!'
    });
});

module.exports = indexRouter;