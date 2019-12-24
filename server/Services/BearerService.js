const CrudService = require('./CrudService');
const BearerDAO = require('../DAO/BearerDAO');
const BearerDTO = require('../DTO/BearerDTO');

class BearerService extends CrudService {
    constructor(services) {
        super("BearerService", BearerDAO, BearerDTO, BearerDTO, services);
    }

}
module.exports = BearerService;