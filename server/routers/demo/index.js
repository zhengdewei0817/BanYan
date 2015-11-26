var Router = require('express').Router;
var checkLogin = require('../../middleware/checkLogin').checkLogin;
var ErrorModal = require('../../libs/errorModal');
var requestApi = require('../../libs/requestApi').api;
var utils = require('../../libs/utils');
var models = require('../../models/index');

var api = ENV_CONFIG.api;
var demoRouter = Router();

demoRouter.route(['/', '/index'])
    .get((req, res, next) => {
        res.render('demo/dialog', {
            title: '弹出层'
        });
    })
    .post((req, res, next) => {
        models.Users.findAll({
            where: {
                mobile: '18612345678'
            }
        }).then((ret) => {
            console.log(ret[0].name);
        });
    });

module.exports = demoRouter;