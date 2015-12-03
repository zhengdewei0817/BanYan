var bodyParser = require('body-parser');
var express = require('express');
var path = require('path');
var _ = require('lodash');
var helper = require('./libs/helper');

var session = require('express-session');
var SessionStore = require('express-mysql-session');
var serveStatic = require('serve-static');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var glob = require('glob');

var configAll = require('../config/env/all');
var utils = require('./libs/utils');
var logger = require('./libs/logger');
var parameter = require('./middleware/index').parameter;

var app = express();
var SERVER_ENV = app.get('env');
var env_name = SERVER_ENV;
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
app.set('view engine', 'jade');

// 生产环境启用缓存
if(env_name === 'production'){
    app.set('view cache', true);
}


// 模板中一些公共的变量
_.assign(app.locals, ENV_CONFIG.locals || {}, helper);
// 当前环境
app.locals.isProduction = (env_name === 'production');

// 设置cookie
app.use(cookieParser('Banyan'));
// session 存到mysql中
var dbConfig = ENV_CONFIG.db;
// 是否设置sessionStore
if(dbConfig.store){
    app.use(session({
        secret: 'Banyan',
        store: dbConfig.store,
        resave: true,
        saveUninitialized: true
    }));
}

// 生产环境直接读取根目录
if(env_name === 'production') {
    app.use(serveStatic(path.join(__dirname, '../public/static/')));
} else {
    app.use(serveStatic('./build'));
}

// 公共的过滤信息
app.use(parameter);

// 路由生成
// 会根据文件名生成父级，如：
// user.js => /user/login
var routersDir = path.join(__dirname, 'routers');
var linuxRouterPath = routersDir.split(path.sep).join('/');
glob.sync(routersDir + '/**/*.js').forEach((file, index) => {
    var _path = file.replace(linuxRouterPath, '');
    var routerPath = _path.split('.js')[0].replace('index', '');
    var router = require(file);
    app.use(`${routerPath}`, router);

});

app.use(logger.use());

// 404
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    res.render('public/404.jade');
});

// 500
app.use((error, req, res) => {
    var statusCode = error.statusCode || 500;
    var err = {
        error: statusCode,
        message: error.message
    };
    if (!res.headersSent) {
        res.render('public/500.jade', err);
    }
});


module.exports = app;