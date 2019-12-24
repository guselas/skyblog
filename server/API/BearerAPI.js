const CrudAPI = require('./CrudAPI');


class BearerAPI extends CrudAPI {
    constructor(uri, app,services) {
        super(uri + '/bearers', app, "Bearers",  services.bearerService);
    }
}

module.exports = BearerAPI;