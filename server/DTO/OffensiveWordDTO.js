const BaseDTO = require('./BaseDTO');

class OffensiveWordDTO extends BaseDTO {
    constructor() {
        super();
        this["$type"] = "OffensiveWordDTO";
        //Los inicializo para que cuando el OffensiveWord rellene un OffensiveWordForm si algun dato falta al menos hay un valor por defecto en la BD
        this.word = "";
        this.level = 1;

    }
}

module.exports = OffensiveWordDTO;