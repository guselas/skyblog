const CrudService = require('./CrudService');
const BearerDAO = require('../DAO/BearerDAO');
const BearerDTO = require('../DTO/BearerDTO');
const FullBearerDTO = require('../DTO/Full/FullBearerDTO');


class BearersService extends CrudService {
    constructor(services) {
        super("BearerService", BearerDAO, BearerDTO, FullBearerDTO, services);
    }

    

}
module.exports = BearersService;