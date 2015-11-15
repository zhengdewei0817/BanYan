var app = require('./server/init');
var logger = require('./server/libs/logger');

var server = app.listen(ENV_CONFIG.port, ENV_CONFIG.hostname || '127.0.0.1', 1024, function() {
    console.log('ENV ' + env_name);
    console.log('Express server listening on port ' + server.address().port);
});