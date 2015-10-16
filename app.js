import app from './lib/server';
import config from './config';
import logger from './lib/logger';

var server = app.listen(config.port, function() {
    console.log('Express server listening on port ' + server.address().port);
});