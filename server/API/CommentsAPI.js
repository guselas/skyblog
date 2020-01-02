const CrudAPI = require('./CrudAPI');

class CommentsAPI extends CrudAPI {
    constructor(uri, app,services) {
        super(uri + '/comments', app, "Comments",services.postsService);
    }
}

module.exports = CommentsAPI;