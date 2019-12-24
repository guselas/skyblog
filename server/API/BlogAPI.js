const BaseAPI = require('./BaseAPI');

class BlogAPI extends BaseAPI {
    constructor(uri, app, nameAPI, blogService) {
        super(uri, app, nameAPI);
        this.blogService = blogService;

        app.get(`${uri}/blog`, this.getAll.bind(this));
        app.get(`${uri}/blog/:blogid`, this.getOne.bind(this));

        app.post(`${uri}/blog/:authorid`, this.newBlog.bind(this));
        app.put(`${uri}/blog/:blogid`, this.updateBlog.bind(this));
        app.delete(`${uri}/blog/:blogid`, this.removeBlog.bind(this));

        app.post(`${uri}/blog/:blogid/comment/:authorid`, this.addComment.bind(this));
        app.put(`${uri}/blog/:blogid/comment/:commentid`, this.updateComment.bind(this));
        app.delete(`${uri}/blog/comment/:commentid`, this.removeComment.bind(this));


    }
//#region 
  //Login 
    //HACER LOGIN
    async login(req, res) {
        console.log("API Users: userLogin(): ");
        const email = req.body.email;
        const password = req.body.password;
        if (!email) {
            this.sendError(res, this.ST_BadRequest, "email mandatory");
        }
        else if (!password) {
            this.sendError(res, this.ST_BadRequest, "password mandatory");
        }
        else {
            var users = await this.crudService.findUsersByEmail(email);
            if (users.length == 0) {
                this.sendError(res, this.ST_NotFound, "email not found");
            }
            else if (users.length > 1) {
                this.sendError(res, this.ST_Conflict, "invalid email");
            }
            else {
                var result = await this.crudService.matchPassword(users[0].id, password);
                if (!result) {
                    this.sendError(res, this.ST_BadRequest, "invalid password");
                }
                else {
                    this.sendData(res, users[0]);
                }
            }
        }
    }

    async bearerLogin(req,res){
        const email = req.body.email;
        const password = req.body.password;
        const description = req.body.description;
        if (!email) {
            this.sendError(res, this.ST_BadRequest, "email mandatory");
        }
        else if (!password) {
            this.sendError(res, this.ST_BadRequest, "password mandatory");
        }
        else {
            var users = await this.crudService.findUsersByEmail(email);
            if (users.length == 0) {
                this.sendError(res, this.ST_NotFound, "email not found");
            }
            else if (users.length > 1) {
                this.sendError(res, this.ST_Conflict, "invalid email");
            }
            else {
                var result = await this.crudService.matchPassword(users[0].id, password);
                if (!result) {              
                    this.sendError(res, this.ST_BadRequest, "invalid password");
                }
                else {
                    var errors = [];
                    var bearerDTO = await this.crudService.createBearer(users[0].id,description,errors);
                    if(bearerDTO){
                        this.sendData(res,bearerDTO);
                    }
                    else{
                        this.sendError(res, this.ST_Conflict, errors);
                    }
                }
            }
        }
    }

    async getLoggedUser(req, res){
        var userDTO = new this.crudService.classDTO();
        userDTO.fromDAO(req.currentUser);
        this.sendData(res, userDTO);
    }
//#endregion



    async getAll(req, res) {
        console.log(`API ${this.nameAPI}: getAll(): `);
        //Normalize filterValues from query
        const filter = {};
        let recordDAO = new this.blogService.DAO.CoffeeShopDAO();
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
            const recordsDTO = await this.blogService.services.coffeeShopsService.readAll(filter, errors);
            if (recordsDTO) {
                this.sendData(res, recordsDTO);
            } else {
                this.sendError(res, this.ST_BadRequest, "readAll()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "readAll()", err.message);
        };
    }

    async getShop(req, res) {
        console.log(`API ${this.nameAPI}: getShop(): `);
        const id = req.params.coffeeShopId;
        try {
            const errors = [];
            const fullRecordDTO = await this.blogService.services.coffeeShopsService.readFullOne(id, errors);
            if (fullRecordDTO) {
                this.sendData(res, fullRecordDTO)
            } else {
                this.sendError(res, this.ST_NotFound, "readFullOne()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "readFullOne()", err.message);
        };
    }

    async newBlog(req, res) {
        console.log(`API blog newBlog()`);
        const coffeeShopId = req.params.coffeeShopId;
        try {
            const errors = [];
            const blogDTO = await this.blogService.newBlog(coffeeShopId, errors);
            if (blogDTO) {
                this.sendData(res, blogDTO)
            } else {
                this.sendError(res, this.ST_NotFound, "newBlog()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "newBlog()", err.message);
        };
    }

    async closeBlog(req, res) {
        console.log(`API blog closeBlog()`);
        const blogId = req.params.blogId;
        try {
            const errors = [];
            const orderDTO = await this.blogService.closeBlog(blogId, errors);
            if (orderDTO) {
                this.sendData(res, orderDTO)
            } else {
                this.sendError(res, this.ST_NotFound, "closeBlog()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "closeBlog()", err.message);
        };
    }

    async addProduct(req, res) {
        console.log(`API blog addProduct()`);
        const blogId = req.params.blogId;
        try {
            var errors = [];
            var docDetailDTO = new this.blogService.DTO.DocDetailDTO();
            this.loadDTOFromBody(docDetailDTO, req.body);
            const blogDTO = await this.blogService.addProduct(blogId, docDetailDTO, errors);
            if (blogDTO) {
                this.sendData(res, blogDTO)
            } else {
                this.sendError(res, this.ST_NotFound, "addProduct()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "addProduct()", err.message);
        };
    }

    async removeProduct(req, res) {
        console.log(`API blog removeProduct()`);
        const blogId = req.params.blogId;
        try {
            var errors = [];
            var docDetailDTO = new this.blogService.DTO.DocDetailDTO();
            this.loadDTOFromBody(docDetailDTO, req.body);
            const blogDTO = await this.blogService.removeProduct(blogId, docDetailDTO, errors);
            if (blogDTO) {
                this.sendData(res, blogDTO)
            } else {
                this.sendError(res, this.ST_NotFound, "removeProduct()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "removeProduct()", err.message);
        };
    }

    async removeSelection(req, res) {
        console.log(`API blog removeSelection()`);
        const docDetailId = req.params.docDetailId;
        try {
            var errors = [];
            const blogDTO = await this.blogService.removeSelection(docDetailId, errors);
            if (blogDTO) {
                this.sendData(res, blogDTO)
            } else {
                this.sendError(res, this.ST_NotFound, "removeSelection()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "removeSelection()", err.message);
        };
    }
}

module.exports = BlogAPI;