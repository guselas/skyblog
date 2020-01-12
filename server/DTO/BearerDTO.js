const BaseDTO = require('./BaseDTO');

class BearerDTO extends BaseDTO {
    constructor() {
        super("Bearer");
        this.userId = "";
        this.description = "";
        this.validUntil = new Date();
        this.lastAccess = new Date(); 
    }
}

module.exports = BearerDTO;