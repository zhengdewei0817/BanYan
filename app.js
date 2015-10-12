import app from './lib/server';
import config from './config';
import logger from './lib/logger';
import models from './lib/server/models'

models.sequelize.sync().then(function () {
    var server = app.listen(config.port, function() {
        console.log('Express server listening on port ' + server.address().port);
    });
});