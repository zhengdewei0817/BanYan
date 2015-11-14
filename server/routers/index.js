import {Router} from 'express';
import {api as requestApi} from '../libs/requestApi';

let api = ENV_CONFIG.api;

var indexRouter = Router();

indexRouter.get('/', (req, res, next) => {

    res.render('index/index', {
        title: 'liluo.me'
    });

});

export default indexRouter;