const BaseDTO = require('./BaseDTO');

class LoginDTO extends BaseDTO {
    constructor() {
        super("Login");
        //Los inicializo para que cuando el user rellene un userForm si algun dato falta al menos hay un valor por defecto en la BD
        this.email = "";
        this.password = "";
    }

}

module.exports = LoginDTO;