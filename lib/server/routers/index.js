import {Router} from 'express';
import {api as requestApi} from '../../requestApi';

let api = server_config.api;

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
            title: '123'
        });
    });

});

export default indexRouter;