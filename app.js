import app from './server/init';
import logger from './server/libs/logger';

var server = app.listen(ENV_CONFIG.port, function() {
    console.log('Express server listening on port ' + server.address().port);
});