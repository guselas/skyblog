
const BaseDTO = require('./BaseDTO');


class BearerDTO extends BaseDTO {
    constructor() {
        super();
        this["$type"] = "BearerDTO";
        this.userId = "";
        this.description = "";
        this.validUntil = new Date();
    }

}

module.exports = BearerDTO;