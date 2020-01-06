const CrudService = require('./CrudService');
const PostDAO = require('../DAO/PostDAO');
const PostDTO = require('../DTO/PostDTO');
const FullPostDTO = require('../DTO/Full/FullPostDTO');

class PostService extends CrudService {
    constructor(services) {
        super("PostService", PostDAO, PostDTO, FullPostDTO, services);
    }

    //Virtual method
    async fillFieldsFullDTO(fullPostDTO, errors) {
        fullPostDTO.author = await this.services.usersService.readOne(fullPostDTO.authorId, errors);
        fullPostDTO.comments = await this.loadPostComments(fullPostDTO.id, errors);
        return fullPostDTO;
    }

    async loadPostComments(postId, errors) {
        return await this.services.commentsService.readAll({
            postId: postId
        }, errors);
    }
}
module.exports = PostService;