const BaseDTO = require('./BaseDTO');

class BlogDTO extends BaseDTO {
    constructor() {
        super("Blog");
        //Los inicializo para que cuando el Blog rellene un BlogForm si algun dato falta al menos hay un valor por defecto en la BD
        this.postTitle = "";
        this.postText = "";
        this.postDate = new Date();
        this.lastUpdate = new Date();

        this.hasComments = false;

        this.email = "";
        this.nickName = "";
    }

    putModel() {
        this["$type"] = "Put" + this.getName();
        delete this.email;
        delete this.nickName;
        delete this.lastUpdate;
        delete this.hasComments;
        return this;
    }

    postModel() {
        delete this.email;
        delete this.nickName;
        delete this.lastUpdate;
        delete this.postDate;
        delete this.hasComments;
        return super.postModel();
    }

}

module.exports = BlogDTO;