var Router = require('express').Router;
var checkLogin = require('../../middleware/checkLogin').checkLogin;
var ErrorModal = require('../../libs/errorModal');
var requestApi = require('../../libs/requestApi').api;
var utils = require('../../libs/utils');
var models = require('../../models/index');

var api = ENV_CONFIG.api;
var userRouter = Router();

userRouter.use(checkLogin);

userRouter.route('/')
    .get((req, res, next) => {
        res.render('user', {
            title: '用户中心'
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

module.exports = userRouter;