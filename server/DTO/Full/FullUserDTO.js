const UserDTO = require('../UserDTO');
const PostDTO = require('../PostDTO');
const CommentDTO = require('../CommentDTO');

class FullUserDTO extends UserDTO {
    constructor() {
        super();
        this["$type"] = "FullUserDTO";
        this.comments = [new CommentDTO()];
        this.posts = [new PostDTO()];
    }
}
    

module.exports = FullUserDTO;