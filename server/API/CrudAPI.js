const BaseAPI = require('./BaseAPI');

class CrudAPI extends BaseAPI {
    constructor(uri, app, nameAPI, crudService) {
        super(uri, app, nameAPI);
        this.crudService = crudService;

        //Aux endPoints
        app.post(`${this.uri}/seed`, this.seed.bind(this)); 
        app.post(`${this.uri}/unseed`, this.unseed.bind(this)); 

        app.get(`${this.uri}/model/full`, this.fullModel.bind(this));
        app.get(`${this.uri}/model/get`, this.model.bind(this));
        app.get(`${this.uri}/model/post`, this.postModel.bind(this));
        app.get(`${this.uri}/model/put`, this.putModel.bind(this));

        app.get(`${this.uri}/model`, this.model.bind(this));

        //CRUD Endpoints
        app.get(`${this.uri}/:id/full`, this.readFullOne.bind(this)); 
        app.post(`${this.uri}/`, this.createOne.bind(this)); 

        app.get(`${this.uri}/`, this.readAll.bind(this)); 
        app.get(`${this.uri}/:id`, this.readOne.bind(this)); 
        app.put(`${this.uri}/:id`, this.updateOne.bind(this)); 
        app.delete(`${this.uri}/:id`, this.deleteOne.bind(this)); 

    }

    async postModel(req, res) {
        console.log(`API ${this.nameAPI}: postModel(): `);
        try {
            const errors = [];
            const recordDTO = this.crudService.postModel();
            if (recordDTO) {
                this.sendData(res, recordDTO)
            } else {
                this.sendError(res, this.ST_NotFound, "postModel()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "postModel()", err.message);
        };
    };

    async putModel(req, res) {
        console.log(`API ${this.nameAPI}: putModel(): `);
        try {
            const errors = [];
            const recordDTO = this.crudService.putModel();
            if (recordDTO) {
                this.sendData(res, recordDTO)
            } else {
                this.sendError(res, this.ST_NotFound, "putModel()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "putModel()", err.message);
        };
    };

    async model(req, res) {
        console.log(`API ${this.nameAPI}: model(): `);
        try {
            const errors = [];
            const recordDTO = this.crudService.model();
            if (recordDTO) {
                this.sendData(res, recordDTO)
            } else {
                this.sendError(res, this.ST_NotFound, "model()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "model()", err.message);
        };
    };

    async fullModel(req, res) {
        console.log(`API ${this.nameAPI}: fullModel(): `);
        try {
            const errors = [];
            const fullRecordDTO = this.crudService.fullModel();
            if (fullRecordDTO) {
                this.sendData(res, fullRecordDTO)
            } else {
                this.sendError(res, this.ST_NotFound, "fullModel()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "fullModel()", err.message);
        };
    };

    async seed(req, res) {
        console.log(`API ${this.nameAPI}: seed(): `);
        try {
            const errors = [];
            const result = await this.crudService.seed();
            if (result) {
                this.sendData(res, result)
            } else {
                this.sendError(res, this.ST_NotFound, "seed()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "seed()", err.message);
        };
    };

    async unseed(req, res) {
        console.log(`API ${this.nameAPI}: unseed(): `);
        try {
            const errors = [];
            const result = await this.crudService.unseed();
            if (result) {
                this.sendData(res, result)
            } else {
                this.sendError(res, this.ST_NotFound, "unseed()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "unseed()", err.message);
        };
    };

    getFilterFromQuery(req) {
        const filter = {};
        let recordDAO = new this.crudService.classDAO();
        for (let prop in req.query) {
            if (prop in recordDAO) {
                if (typeof recordDAO[prop] == "string") {
                    filter[prop] = {
                        $regex: req.query[prop]
                    };
                } else if (recordDAO[prop] instanceof Date) {
                    try {
                        var dateDirty = new Date(req.query[prop]);
                        var dateClean = new Date(dateDirty.getFullYear(), dateDirty.getMonth(), dateDirty.getDay());
                        filter[prop] = dateClean.toISOString();
                    } catch (error) {}
                } else {
                    filter[prop] = req.query[prop];
                }
            }
        }
        return filter;
    }

    //#region CRUD
    async readAll(req, res) {
        console.log(`API ${this.nameAPI}: readAll(): `);
        //Normalize filterValues from query
        const filter = {};
        let recordDAO = new this.crudService.classDAO();
        for (let prop in req.query) {
            if (prop in recordDAO) {
                if (typeof recordDAO[prop] == "string") {
                    filter[prop] = {
                        $regex: req.query[prop]
                    };
                } else if (recordDAO[prop] instanceof Date) {
                    try {
                        var dateDirty = new Date(req.query[prop]);
                        var dateClean = new Date(dateDirty.getFullYear(), dateDirty.getMonth(), dateDirty.getDay());
                        filter[prop] = dateClean.toISOString();
                    } catch (error) {

                    }
                } else {
                    filter[prop] = req.query[prop];
                }
            }
        }
        try {
            let errors = [];
            const recordsDTO = await this.crudService.readAll(filter, errors);
            if (recordsDTO) {
                this.sendData(res, recordsDTO);
            } else {
                this.sendError(res, this.ST_BadRequest, "readAll()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "readAll()", err.message);
        };
    };

    async readFullOne(req, res) {
        console.log(`API ${this.nameAPI}: readFullOne(): `);
        const id = req.params.id;
        try {
            const errors = [];
            const fullRecordDTO = await this.crudService.readFullOne(id, errors);
            if (fullRecordDTO) {
                this.sendData(res, fullRecordDTO)
            } else {
                this.sendError(res, this.ST_NotFound, "readFullOne()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "readFullOne()", err.message);
        };
    };

    async readOne(req, res) {
        console.log(`API ${this.nameAPI}: readOne(): `);
        const id = req.params.id;
        try {
            const errors = [];
            const recordDTO = await this.crudService.readOne(id, errors);
            if (recordDTO) {
                this.sendData(res, recordDTO)
            } else {
                this.sendError(res, this.ST_NotFound, "readOne()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "readOne()", err.message);
        };
    };

    async createOne(req, res) {
        console.log(`API ${this.nameAPI}: createOne(): `);
        try {
            var errors = [];
            var recordDTO = new this.crudService.classDTO();
            this.loadDTOFromBody(recordDTO, req.body);
            recordDTO = await this.crudService.createOne(recordDTO, errors);
            if (recordDTO) {
                this.sendData(res, recordDTO);
            } else {
                this.sendError(res, this.ST_Conflict, "createOne()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "createOne()", err.message);
        }
    };


    async updateOne(req, res) {
        console.log(`API ${this.nameAPI}: updateOne(): `);
        const id = req.params.id;
        try {
            var errors = [];
            var recordDTO = await this.crudService.readOne(id, errors);
            if (recordDTO) {
                this.loadDTOFromBody(recordDTO, req.body);
                recordDTO = await this.crudService.updateOne(recordDTO, id, errors);
                if (recordDTO) {
                    this.sendData(res, recordDTO);
                } else {
                    this.sendError(res, this.ST_Conflict, "updateOne()", errors);
                }
            } else {
                this.sendError(res, this.ST_NotFound, "updateOne()", `id ${id} not found`);
            }
        } catch (error) {
            this.sendError(res, this.ST_InternalServerError, "updateOne()", error.message);
        }
    };

    async deleteOne(req, res) {
        console.log(`API ${this.nameAPI}: deleteOne(): `);
        var id = req.params.id;
        try {
            var errors = [];
            const recordDTO = await this.crudService.readOne(id, errors);
            if (recordDTO) {
                if (await this.crudService.deleteOne(id, errors)) {
                    this.sendData(res, recordDTO);
                } else {
                    this.sendError(res, this.ST_Conflict, "deleteOne()", errors);
                }
            } else {
                this.sendError(res, this.ST_NotFound, "deleteOne()", `id ${id} not found`);
            }
        } catch (error) {
            this.sendError(res, this.ST_InternalServerError, "deleteOne()", error.message);
        };
    }
    //#endregion
}

module.exports = CrudAPI;