class PostContext {
    constructor() {
        this.mongoose = require('mongoose');
        this.Services = require('../Services/Services');
        this.PostsService = require('../Services/PostsService');
        this.services = new this.Services();
        this.services.DAO.PostDAO = require('../DAO/PostDAO');
        this.services.DTO.PostDTO = require('../DTO/PostDTO');
        this.services.DAO.FullPostDTO = require('../DTO/FullPostDTO');

        this.services.services.postsService = new this.PostsService(this.services);

        this.postsService = this.services.services.postsService;

    }

    async connect(host, dbName) {
        this.connection = await this.mongoose.connect(`mongodb://${host}/${dbName}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 4000
        });
        return this.connection;
    }

    async clearContextData() {
        if (this.connection) {
            let postsDAO = await this.services.DAO.PostDAO.find();
            if (postsDAO) {
                for (let postDAO of postsDAO) {
                    await this.services.DAO.postDAO.deleteOne({
                        _id: postDAO._id
                    });
                }
            }
        }
    }
}


test('After clearing contextDB no record is found', async () => {
    let context = new PostContext();
    let connection = await context.connect("localhost", "skyBlogTest");
    if (connection) {
        await context.clearContextData();
        var errors = [];
        let postsDTO = await context.postsService.readAll({}, errors);
        expect(postsDTO.length).toBe(0);
    }
});