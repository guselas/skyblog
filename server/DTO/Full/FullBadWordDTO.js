const BadWordDTO = require('../BadWordDTO');

class FullBadWordDTO extends BadWordDTO {
    constructor() {
        super();
        this["$type"] = "FullBadWordDTO";
    }
}
    

module.exports = FullBadWordDTO;