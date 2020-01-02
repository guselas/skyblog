const CrudService = require('./CrudService');
const CommentDAO = require('../DAO/CommentDAO');
const CommentDTO = require('../DTO/CommentDTO');
const FullCommentDTO = require('../DTO/Full/FullCommentDTO');


class CommentsService extends CrudService {
    constructor(services) {
        super("CommentService", CommentDAO, CommentDTO, FullCommentDTO, services);
    }

    async fillFieldsFullDTO(fullCommentDTO, errors) {
        fullCommentDTO.user = await this.services.usersService.readOne(fullCommentDTO.userId, errors);
        return fullCommentDTO;
    }


}
module.exports = CommentsService;