import log4js from "log4js";
import config from '../config';

log4js.configure({
    appenders: [
        { type: 'console' },
        {
            type: 'dateFile',
            "filename": config.logfilename || 'file.log',
            "pattern": "-yyyy-MM-dd",
            "alwaysIncludePattern": true
        }
    ],
    replaceConsole: true
});

exports.log = function(name){
    return log4js.getLogger(name)
}

exports.use = function() {
    return log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' })
}