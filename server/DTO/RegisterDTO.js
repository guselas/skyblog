const BaseDTO = require('./BaseDTO');

class RegisterDTO extends BaseDTO {
    constructor() {
        super("Register");
        //Los inicializo para que cuando el user rellene un userForm si algun dato falta al menos hay un valor por defecto en la BD
        this.email = "";
        this.nickName = "";
        this.password = "";
    }

}

module.exports = RegisterDTO;