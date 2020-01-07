const BaseDTO = require('./BaseDTO');

class BadWordDTO extends BaseDTO {
    constructor() {
        super("BadWord");
        //Los inicializo para que cuando el BadWord rellene un BadWordForm si algun dato falta al menos hay un valor por defecto en la BD
        this.word = "";
        this.level = 1;

    }

    checkWord() {
        if (!this.word) {
            throw new Error(`word '${this.word}' invalid`);
        }
    }

    normalizeWord() {
        if (this.word) {
            this.word = this.word.toLowerCase().trim();

        }
        this.checkWord();
    }

    toDAO(recordDAO) {
        this.normalizeWord();
        return super.toDAO(recordDAO);
    }
}

module.exports = BadWordDTO;