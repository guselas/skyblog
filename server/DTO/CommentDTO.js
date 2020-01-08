const BaseDTO = require('./BaseDTO');

class CommentDTO extends BaseDTO {
    constructor() {
        super("Comment");
        //Los inicializo para que cuando el Comment rellene un CommentForm si algun dato falta al menos hay un valor por defecto en la BD
        this.postId = "";
        this.commentDate = new Date();
        this.authorId = "";
        this.isApproved = false;
        this.commentText = "";
        this.lastUpdate = new Date();

    }
}

module.exports = CommentDTO;