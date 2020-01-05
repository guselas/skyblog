const CrudAPI = require('./CrudAPI');

class UsersAPI extends CrudAPI {
    constructor(uri, app,services) {
        super(uri + '/users', app, "Users",services.usersService);
        app.get(`${uri}/login/model`, this.loginModel.bind(this));
        app.post(`${uri}/login`, this.login.bind(this));
    }

    async loginModel(req, res) {
        let model = new this.crudService.DTO.LoginDTO();
        this.sendData(res, model.postModel());
    }

    async login(req, res) {
        let loginDTO = new this.crudService.DTO.LoginDTO();
        this.loadDTOFromBody(loginDTO, req.body);
        const description = JSON.stringify({
            ip: req.ip,
            agent: req.useragent
        });
        var errors = [];
        var whoAmIDTO = await this.crudService.login(loginDTO, description, errors);
        if (whoAmIDTO) {
            for (let index in req.app.currentLogins) {
                if (req.app.currentLogins[index].id == whoAmIDTO.id) {
                    req.app.currentLogins[index] = whoAmIDTO;
                    console.log('currentLogin updated');
                }
            }
            this.sendData(res, {
                Authorization: `Bearer ${whoAmIDTO.id}`
            });
        } else {
            req.currentLogin = null;
            this.sendError(res, this.ST_Conflict, errors);
        }
    }

}

module.exports = UsersAPI;