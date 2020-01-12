const BaseDTO = require('./BaseDTO');
const BearerDTO = require('./BearerDTO');

class WhoAmIDTO extends BaseDTO {
    constructor() {
        super("WhoAmI");
        //WhoAmI.Id == BearerDTO.id en MongoDB
        //From BearerDTO
        this.userId = "";
        this.validUntil = new Date();
        this.lastAccess = new Date();
        
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

module.exports = WhoAmIDTO;