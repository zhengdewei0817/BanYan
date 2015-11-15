module.exports = (sequelize, DataTypes) => {
    var Users = sequelize.define("Users", {
        mobile: DataTypes.STRING,
        passwd: DataTypes.STRING,
        name: DataTypes.STRING,
        sex: DataTypes.INTEGER,
        mail: DataTypes.STRING,
        tel: DataTypes.STRING
    }, {
        tableName: 't_users'
    });

    return Users;
}