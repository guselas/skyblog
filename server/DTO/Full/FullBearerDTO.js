const BearerDTO = require('../BearerDTO');

class FullBearerDTO extends BearerDTO {
    constructor() {
        super();
        this["$type"] = "FullBearerDTO";
    }
}
    

module.exports = FullBearerDTO;