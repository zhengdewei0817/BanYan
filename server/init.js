import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';
import ejs from 'ejs';
ejs._with = false;
ejs.open = '{';
import ejsmate from 'ejs-mate';

import session from 'express-session';
import SessionStore from 'express-mysql-session';
import serveStatic from 'serve-static';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import glob from 'glob';

import configAll from '../config/env/all';
import utils from './libs/utils';
import logger from './libs/logger';
import {parameter} from './middleware/index';

var app = express();
let SERVER_ENV = app.get('env');
let env_name = SERVER_ENV;
global.env_name = env_name;
global.ENV_CONFIG = utils.extend(configAll, require('../config/env/' + env_name));


logger.init(ENV_CONFIG.logfilename);

// 静态压缩
app.use(compression());
// 限制上传50M
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: false, limit: '50mb'}));

// views
app.set('views', path.join(__dirname, '../public/views/'));
app.set('view engine', 'html');
app.engine('html', ejsmate);

// 生产环境启用缓存
if(env_name === 'production'){
    app.set('view cache', true);
}

// 模板中一些公共的变量
utils.extend(app.locals, ENV_CONFIG.locals || {});
// 当前环境
app.locals.isProduction = (env_name === 'production');

// 设置cookie
app.use(cookieParser('vw'));
// session 存到mysql中
let mysqlConfig = ENV_CONFIG.mysql;
//app.use(session({
//    secret: 'vw',
//    store: new SessionStore({
//        host: mysqlConfig.host,
//        port: mysqlConfig.port,
//        user: mysqlConfig.username,
//        password: mysqlConfig.password,
//        database: mysqlConfig.database,
//        schema: {
//            tableName: 'node_session',
//            columnNames: {
//                session_id: 'session_id',
//                expires: 'expires',
//                data: 'data'
//            }
//        }
//    }),
//    resave: true,
//    saveUninitialized: true
//}));

// 生产环境直接读取根目录
if(env_name === 'production') {
    app.use(serveStatic(path.join(__dirname, '../public/static/')));
} else {
    app.use(serveStatic('./build'));
}

// 公共的过滤信息
app.use(parameter);

// 路由生成
let routersDir = path.join(__dirname, 'routers');
glob.sync(routersDir + '/**/*.js').forEach((file, index) => {
    let routerName = path.basename(file, '.js');
    routerName = routerName.replace('index', '');
    let router = require(file);
    app.use(`/${routerName}`, router);

});


app.use(logger.use());

// 404
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    res.render('public/404.html');
});

// 500
app.use((error, req, res) => {
    var statusCode = error.statusCode || 500;
    var err = {
        error: statusCode,
        message: error.message
    };
    if (!res.headersSent) {
        res.render('public/500.html', err);
    }
});


export default app;