const CrudService = require('./CrudService');
const BearerDAO = require('../DAO/BearerDAO');
const BearerDTO = require('../DTO/BearerDTO');
const FullBearerDTO = require('../DTO/Full/FullBearerDTO');


class BearersService extends CrudService {
    constructor(services) {
        super("BearerService", BearerDAO, BearerDTO, FullBearerDTO, services);
    }

    //overrided method
    async checkFieldsId(bearerDTO, errors) {
        var ok = super.checkFieldsId(bearerDTO, errors);
        if(ok){
            //check UserId
            try {
                let userDAO = await this.DAO.UserDAO.findById(bearerDTO.userId);
                if(!userDAO){
                    ok = false;
                    errors.push(`UserId "${bearerDTO.userId}" not found`);
                }
            } catch (error) {
                ok = false;
                errors.push(`UserId "${bearerDTO.userId}" invalid: ${error.message}`);
            }
        } 
        return ok;
    }


}
module.exports = BearersService;