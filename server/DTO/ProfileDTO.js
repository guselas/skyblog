const BaseDTO = require('./BaseDTO');

class ProfileDTO extends BaseDTO {
    constructor() {
        super("Profile");
        
        //From UserDAO
        this.email = "";
        this.nickName = "";
        this.isAuthor = false;
        this.isBlocked = false;
        this.isAdmin = false;
        this.lastLogin = new Date();
        this.registerDate = new Date();
    }

}

module.exports = ProfileDTO;