import {Router} from 'express';
import {checkLogin} from '../middleware/checkLogin';
import ErrorModal from '../libs/errorModal';
import {api as requestApi} from '../libs/requestApi';
import utils from '../libs/utils';
import models from '../models';

let api = ENV_CONFIG.api;
let userRouter = Router();

userRouter.use(checkLogin);

userRouter.route('/')
    .get((req, res, next) => {
        res.render('user', {
            user: req.session.user
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

export default userRouter;