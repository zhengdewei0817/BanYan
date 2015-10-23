import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import ejs from 'ejs-mate';
import session from 'express-session';
import SessionStore from 'express-mysql-session';
import serveStatic from 'serve-static';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import glob from 'glob';
import configAll from '../config/env/all';

var app = express();
let SERVER_ENV = app.get('env');
let env_name = SERVER_ENV;
global.env_name = env_name;
global.ENV_CONFIG = utils.extend(configAll, require('../config/env/' + env_name));

import utils from './libs/utils';
import logger from './libs/logger';

logger.init(ENV_CONFIG.logfilename);

app.use(morgan('short'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: 100000000}));
app.use(require('method-override')());

// views
app.set('views', path.join(__dirname, '../public/views/'));
app.set('view engine', 'html');
app.engine('html', ejs);
app.enable('trust proxy');

// 生产环境启用缓存
if(env_name === 'production'){
    app.enable('view cache');
}

// 模板中一些公共的变量
utils.extend(app.locals, ENV_CONFIG.locals || {});
// 当前环境
app.locals.isProduction = (env_name === 'production');

// 生产环境直接读取根目录
if(env_name === 'production') {
    app.use(serveStatic(path.join(__dirname, '../public')));
} else {
    app.use(serveStatic('./dest'));
}

app.use(compression());
app.use(cookieParser('vwdirect'));
// session 存到mysql中
let mysqlConfig = ENV_CONFIG.mysql;
app.use(session({
    secret: 'vwdirect',
    store: new SessionStore({
        host: mysqlConfig.host,
        port: mysqlConfig.port,
        user: mysqlConfig.username,
        password: mysqlConfig.password,
        database: mysqlConfig.database,
        schema: {
            tableName: 'node_session',
            columnNames: {
                session_id: 'session_id',
                expires: 'expires',
                data: 'data'
            }
        }
    }),
    resave: true,
    saveUninitialized: true
}));

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
    res.status(404).end();
});

// 500
app.use((error, req, res) => {
    var statusCode = error.statusCode || 500;
    var err = {
        error: statusCode,
        message: error.message
    };
    if (!res.headersSent) {
        res.status(statusCode).send(err);
    }
});


export default app;