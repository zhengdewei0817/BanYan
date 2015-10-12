import Sequelize from 'sequelize';
import config from '../../../config';


let env = process.env.NODE_ENV === 'production' ? 'production' :  'dev';
let mysqlConfig    = config[env];
mysqlConfig.dialect = 'mysql';
let sequelize = new Sequelize(config.database, config.username, config.password, config);

export default {
    sequelize,
    Sequelize
}