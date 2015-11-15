var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var logger = require('../libs/logger');

var sqlLog = logger.log('SQL');

var mysqlConfig = ENV_CONFIG.mysql;
var sequelize = new Sequelize(mysqlConfig.database, mysqlConfig.username, mysqlConfig.password, {
    host: mysqlConfig.host,
    port: mysqlConfig.port,
    dialect: 'mysql',
    logging: function(log){
        sqlLog.info(log);
    },
    // 不需要创建createdAt|updatedAt2个字段
    define: {
        underscored: false,
        freezeTableName: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: false
    },
    maxConcurrentQueries: 120
});

var db = {};

fs
    .readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function (file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function (modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;