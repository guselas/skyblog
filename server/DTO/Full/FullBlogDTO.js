const BlogDTO = require('../BlogDTO');
const BlogCommentDTO = require('../BlogCommentDTO');

class FullBlogDTO extends BlogDTO {
    constructor() {
        super();
        this["$type"] = "FullBlogDTO";
        this.comments = [new BlogCommentDTO()];
    }
}

module.exports = FullBlogDTO;