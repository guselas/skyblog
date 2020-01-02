const CommentDTO = require('../CommentDTO');
const UserDTO = require('../UserDTO');


class FullCommentDTO extends CommentDTO {
    constructor() {
        super();
        this["$type"] = "FullCommentDTO";
        this.user = new UserDTO();
    }
}
    

module.exports = FullCommentDTO;