const CrudService = require('./CrudService');
const CommentDAO = require('../DAO/CommentDAO');
const CommentDTO = require('../DTO/CommentDTO');
const FullCommentDTO = require('../DTO/Full/FullCommentDTO');


class CommentsService extends CrudService {
    constructor(services) {
        super("CommentService", CommentDAO, CommentDTO, FullCommentDTO, services);
    }

    //Overrided method
    async checkFieldsId(commentDTO, errors) {
        var ok = super.checkFieldsId(commentDTO, errors);
        if (ok) {
            //check UserId
            try {
                let userDAO = await this.DAO.UserDAO.findById(commentDTO.authorId);
                if (!userDAO) {
                    ok = false;
                    errors.push(`AuthorId "${FullCommentDTO.author}" not found`);

                    // errors.push(`AuthorId "${postDTO.authorId}" not found`);
                }
            } catch (error) {
                ok = false;
                errors.push(`AuthorId "${FullCommentDTO.author}" invalid: ${error.message}`);

                // errors.push(`AuthorId "${postDTO.authorId}" invalid: ${error.message}`);
            }
            //check PostId
            try {
                let postDAO = await this.DAO.PostDAO.findById(commentDTO.postId);
                if (!postDAO) {
                    ok = false;
                    errors.push(`PostId "${postDTO.postId}" not found`);
                }
            } catch (error) {
                ok = false;
                errors.push(`PostId "${postDTO.postId}" invalid: ${error.message}`);
            }
        }
        return ok;
    }

    async fillFieldsFullDTO(fullCommentDTO, errors) {
        fullCommentDTO.author = await this.services.usersService.readOne(fullCommentDTO.authorId, errors);
        return fullCommentDTO;
    }


}
module.exports = CommentsService;