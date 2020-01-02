const CrudAPI = require('./CrudAPI');

class BadWordsAPI extends CrudAPI {
    constructor(uri, app,services) {
        super(uri + '/badwords', app, "BadWords",services.badWordsService);
    }
}

module.exports = BadWordsAPI;