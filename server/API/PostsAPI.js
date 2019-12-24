const CrudAPI = require('./CrudAPI');

class PostsAPI extends CrudAPI {
    constructor(uri, app,services) {
        super(uri + '/posts', app, "Posts",services.PostsService);
    }
}

module.exports = PostsAPI;