const CrudAPI = require('./CrudAPI');

class UsersAPI extends CrudAPI {
    constructor(uri, app,services) {
        super(uri + '/users', app, "Users",services.usersService);
    }
}

module.exports = UsersAPI;