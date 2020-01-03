
const BaseDTO = require('./BaseDTO');

class UserDTO extends BaseDTO {
    constructor() {
        super("User");
        //Los inicializo para que cuando el user rellene un userForm si algun dato falta al menos hay un valor por defecto en la BD
        this.email = "";
        this.nickName = "";
        this.password = "";
        this.isAuthor = false;
        this.isCommentator = false;
        this.isBlocked = false;
        this.isAdmin = false;
        this.lastLogin = new Date();
        this.registerDate = new Date();
    }

    putModel() {
        this["$type"] = "Put" + this.getName();
        delete this.password;
        return this;
    }

    postModel() {
        this.password = "";
        return super.postModel();
    }

    checkEmail() {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.email)) {
            throw new Error(`email ${this.email} invalid`);
        }
    }

    normalizeEmail() {
        if (this.email) {
            this.email = this.email.toLowerCase().trim().split(' ').join('');

        }
        this.checkEmail();
    }



    toDAO(recordDAO) {
        this.normalizeEmail();
        this.normalizeDate("lastLogin");
        return super.toDAO(recordDAO);
    }

}

module.exports = UserDTO;
