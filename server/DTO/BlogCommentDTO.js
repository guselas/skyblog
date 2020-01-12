const BaseDTO = require('./BaseDTO');

class BlogCommentDTO extends BaseDTO {
    constructor() {
        super("BlogComment");
        //Los inicializo para que cuando el BlogComment rellene un BlogCommentForm si algun dato falta al menos hay un valor por defecto en la BD

        this.commentDate = new Date();
        this.commentText = "";
        this.lastUpdate = new Date();

        this.email = "";
        this.nickName = "";
    }

    putModel() {
        this["$type"] = "Put" + this.getName();
        delete this.email;
        // delete this.nickName;
        delete this.lastUpdate;
        return this;
    }

    postModel() {
        delete this.email;
        // delete this.nickName;
        delete this.lastUpdate;
        delete this.commentDate;
        return super.postModel();
    }

}

module.exports = BlogCommentDTO;