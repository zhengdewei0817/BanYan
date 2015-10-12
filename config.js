export default {
    logfilename: './logs/test.log',
    port: 3000,
    production: {
        mysql: {
            host: 'localhost',
            port: 3306,
            username: 'test',
            password: 'test',
            database: 'test'
        }
    },
    dev: {
        api: {
            pc: 'http://www.liluo.me/'
        },
        mysql: {
            host: 'localhost',
            port: 3306,
            username: 'test',
            password: 'test',
            database: 'test'
        }
    }
}