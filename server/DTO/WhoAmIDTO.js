const BaseDTO = require('./BaseDTO');
const BearerDTO = require('./BearerDTO');

class WhoAmIDTO extends BaseDTO {
    constructor() {
        super("WhoAmI");
        //Los inicializo para que cuando el user rellene un userForm si algun dato falta al menos hay un valor por defecto en la BD
        this.userId = "";
        this.validUntil = new Date();
        this.lastAccess = new Date();
        
        this.email = "";
        this.nickName = "";
        this.isAuthor = false;
        this.isBlocked = false;
        this.isAdmin = false;
        this.lastLogin = new Date();
        this.registerDate = new Date();
        //this.BearerToken ??
    }

}

module.exports = WhoAmIDTO;