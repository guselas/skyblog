const BaseService = require('./BaseService');

class CrudService extends BaseService {
    constructor(nameService, classDAO, classDTO, fullClassDTO, services) {
        super();
        this.nameService = nameService;
        this.classDAO = classDAO;
        this.classDTO = classDTO;
        this.fullClassDTO = fullClassDTO;

        this.services = services.services;
        this.DAO = services.DAO;
        this.DTO = services.DTO;
    }

    postModel() {
        //model to use when createOne()
        var postModelDTO = new this.classDTO();
        return postModelDTO.postModel();
    }

    putModel() {
        //model to use when updateOne()
        var putModelDTO = this.model();
        return putModelDTO.putModel();
    }

    model() {
        return new this.classDTO();
    }

    fullModel() {
        return new this.fullClassDTO();
    }

    async recordsCount(filter, errors) {
        try {
            let count = await this.classDAO.where(filter).countDocuments();
            if (count) {
                return count;
            }
        } catch (error) {
            errors.push(errors.message);
        }
        return null;
    }

    async readAll(filter, sorter, pageSize, pageIndex, errors) {
        sorter = this.checkSorter(sorter, this.classDTO);
        if (!sorter) {
            sorter = {
                _id: 1
            };
        }
        if (!pageSize) {
            pageSize = 10;
        }
        if (!pageIndex) {
            pageIndex = 0;
        }
        if ("pageSize" in filter) {
            delete filter.pageSize;
        }
        if ("pageIndex" in filter) {
            delete filter.pageIndex;
        }
        let allRecordsDTO = [];
        let allRecordsDAO = await this.classDAO.find(filter).sort(sorter).skip(pageIndex * pageSize).limit(Number(pageSize));
        if (allRecordsDAO) {
            for (let recordDAO of allRecordsDAO) {
                let recordDTO = new this.classDTO();
                allRecordsDTO.push(recordDTO.fromDAO(recordDAO));
            }
        }
        return allRecordsDTO;
    }

    async readOne(id, errors) {
        //Busco un registro DAO por su id y si se encuentra lo traspaso a un nuevo registro DTO y lo devuelvo.
        let recordDAO = await this.classDAO.findById(id);
        if (recordDAO) {
            let recordDTO = this.model();
            recordDTO.fromDAO(recordDAO);
            return recordDTO;
        }
        errors.push(`${this.nameService}.readOne(): Id "${id}" not found`);
        return null;
    }

    //Aux Methods
    //#region  Virtual & generic method
    async fillFieldsFullDTO(recordFullDTO, errors) {
        //TO Be override by the derived service 
        return recordFullDTO;
    }

    async readFullOne(id, errors) {
        let recordDAO = await this.classDAO.findById(id);
        if (recordDAO) {
            let recordFullDTO = this.fullModel();
            recordFullDTO.fromDAO(recordDAO);
            recordFullDTO = await this.fillFieldsFullDTO(recordFullDTO, errors);
            return recordFullDTO;
        }
        errors.push(`${this.nameService}.readFullOne(): Id "${id}" not found`);
        return null;
    }

    async checkFieldsId(recordDTO, errors) {
        var ok = true;
        //TO Be override by the derived service 
        return ok;
    }

    async canCreateOne(recordDTO, errors) {
        return await this.checkFieldsId(recordDTO, errors);
    }

    async createOne(recordDTO, errors) {
        if (await this.canCreateOne(recordDTO, errors)) {
            var recordDAO = recordDTO.toDAO(this.classDAO());
            recordDAO = await recordDAO.save(recordDAO);
            recordDTO.fromDAO(recordDAO);
            return recordDTO.putModel();
        }
        return null;
    }

    async canUpdateOne(recordDTO, errors) {
        return await this.checkFieldsId(recordDTO, errors);
    }

    async updateOne(recordDTO, id, errors) {
        if (await this.canUpdateOne(recordDTO, errors)) {
            var recordDAO = await this.classDAO.findById(id);
            if (recordDAO) {
                if (recordDTO.rowVersion !== recordDAO.__v) {
                    errors.push(`${this.nameService}.updateOne(): invalid rowVersion`);
                    return null;
                } else {
                    recordDTO.toDAO(recordDAO);
                    recordDAO.__v++;
                    recordDAO = await recordDAO.save();
                    recordDTO.fromDAO(recordDAO);
                    return recordDTO.putModel();
                }
            }
            errors.push(`${this.nameService}.updateOne(): Id "${id}" not found`);
        }
        return null;
    }

    async canDeleteOne(id, errors) {
        //TO Be override by the derived service 
        var ok = true;
        return ok;
    }

    async deleteOne(id, errors) {
        if (await this.canDeleteOne(id, errors)) {
            const recordDAO = await this.classDAO.findById(id);
            if (recordDAO) {
                await this.classDAO.deleteOne({
                    _id: id
                });
                return true;
            }
            errors.push(`${this.nameService}.deleteOne(): Id "${id}" not found`);
        }
        return false;
    }
    //#endregion

    checkSorter(sorter, classDTO) {
        let ok = false;
        if (sorter) {
            let result = {};
            let recordDTO = new classDTO();
            recordDTO = recordDTO.postModel();
            for (let field in sorter) {
                if (field in recordDTO) {
                    result[field] = sorter[field];
                    ok = true;
                }
            }
            if (ok) {
                return result;
            }
        }
        return null;
    }

}
module.exports = CrudService;