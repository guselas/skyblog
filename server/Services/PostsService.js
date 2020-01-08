const CrudService = require('./CrudService');
const PostDAO = require('../DAO/PostDAO');
const PostDTO = require('../DTO/PostDTO');
const FullPostDTO = require('../DTO/Full/FullPostDTO');

class PostService extends CrudService {
    constructor(services) {
        super("PostService", PostDAO, PostDTO, FullPostDTO, services);
    }

    //#region Aux Overrided Methods
    async checkFieldsId(postDTO, errors) {
        var ok = super.checkFieldsId(postDTO, errors);
        if (ok) {
            //check UserId
            try {
                let userDAO = await this.DAO.UserDAO.findById(postDTO.authorId);
                if (!userDAO) {
                    ok = false;
                    errors.push(`AuthorId "${postDTO.authorId}" not found`);
                }
            } catch (error) {
                ok = false;
                errors.push(`AuthorId "${postDTO.authorId}" invalid: ${error.message}`);
            }
        }
        return ok;
    }

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
    //#endregion

    //#region CRUD Methods
    async canDeleteOne(id, errors) {
        var ok = await super.canDeleteOne(id, errors);
        if (ok) {
            let commentsDAO = await this.DAO.CommentDAO.find({
                postId: id
            }).limit(1);
            if (commentsDAO) {
                if (commentsDAO.length > 1) {
                    ok = false;
                    errors.push("Post has comments linked");
                }
            }
        }
        return ok;
    }
    //#endregion
}
module.exports = PostService;