module.exports = {
    port: 3000,
    logfilename: './logs/test.log',

    mysql: {
        host: 'localhost',
        port: 3306,
        username: 'test',
        password: 'test',
        database: 'test',
        locals: {
            IMAGE_BASE_DIR_URL: '/static'
        }
    }
}