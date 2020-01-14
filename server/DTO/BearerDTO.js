const BaseDTO = require('./BaseDTO');

class BearerDTO extends BaseDTO {
    //to use only with crudApp
    constructor() {
        super("Bearer");
        this.userId = "";
        this.description = "";
        this.validUntil = new Date();
        this.lastAccess = new Date(); 
    }
}

module.exports = BearerDTO;