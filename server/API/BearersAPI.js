const CrudAPI = require('./CrudAPI');


class BearersAPI extends CrudAPI {
    constructor(uri, app,services) {
        super(uri + '/bearers', app, "Bearers",  services.bearersService);
    }
}

module.exports = BearersAPI;