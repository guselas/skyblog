const PostDTO = require('./PostDTO');
const UserDTO = require('./UserDTO');
const CommentDTO = require('./CommentDTO');

class FullPostDTO extends PostDTO {
    constructor() {
        super();
        this["$type"] = "FullPostDTO";
        this.author = new UserDTO();;
        this.comments = [new CommentDTO()];
    }
}

module.exports = FullPostDTO;