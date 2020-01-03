const BaseDTO = require('./BaseDTO');

class PostDTO extends BaseDTO {
    constructor() {
        super("Post");
        //Los inicializo para que cuando el Post rellene un PostForm si algun dato falta al menos hay un valor por defecto en la BD
        this.postTitle = "";
        this.postText = "";
        this.authorId = "";
        this.postDate = new Date();
        this.lastUpdate = new Date();
    }
}

module.exports = PostDTO;