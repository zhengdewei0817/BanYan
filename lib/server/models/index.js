import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import config from '../../../config';
import logger from '../../logger';

var sqlLog = logger.log('SQL');

let env = process.env.NODE_ENV === 'production' ? 'production' : 'dev';
let mysqlConfig = config[env].mysql;
let sequelize = new Sequelize(mysqlConfig.database, mysqlConfig.username, mysqlConfig.password, {
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

let db = {};

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

export default db;