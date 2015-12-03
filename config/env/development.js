module.exports = {
    port: 5000,
    logfilename: './logs/test.log',
    db: {
        store: null,
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
}