const BaseAPI = require('./BaseAPI');

class BlogAPI extends BaseAPI {
    constructor(uri, app, services) {
        super(uri, app, 'Blog');
        this.blogService = services.blogService;

        //#region Endpoints Model
        app.get(`${uri}/blog/login/model`, this.loginModel.bind(this));
        app.get(`${uri}/blog/register/model`, this.registerModel.bind(this));
        app.get(`${uri}/blog/whoami/model`, this.whoAmIModel.bind(this));
        app.get(`${uri}/blog/who/model`, this.whoModel.bind(this));
        app.get(`${uri}/blog/all/model`, this.getAllModel.bind(this));

        app.get(`${uri}/blog/model`, this.getBlogModel.bind(this));
        app.get(`${uri}/blog/post/model`, this.postBlogModel.bind(this));
        app.get(`${uri}/blog/put/model`, this.putBlogModel.bind(this));

        app.get(`${uri}/blog/comment/post/model`, this.postCommentModel.bind(this));
        app.get(`${uri}/blog/comment/put/model`, this.putCommentModel.bind(this));
        //#endregion
        //#region Endpoints BlogApp

        app.post(`${uri}/blog/login`, this.login.bind(this));
        app.post(`${uri}/blog/register`, this.register.bind(this));
        app.get(`${uri}/blog/whoami`, this.getLoggedUser.bind(this));
        app.get(`${uri}/blog/who`, this.getLoggedUsers.bind(this));


        app.get(`${uri}/blog`, this.getAll.bind(this));
        app.get(`${uri}/blog/:blogid`, this.getBlog.bind(this));

        app.post(`${uri}/blog`, this.newBlog.bind(this));
        app.put(`${uri}/blog/:blogid`, this.updateBlog.bind(this));
        app.delete(`${uri}/blog/:blogid`, this.deleteBlog.bind(this));

        app.post(`${uri}/blog/:blogid/comment`, this.newComment.bind(this));
        app.put(`${uri}/blog/:blogid/comment/:commentid`, this.updateComment.bind(this));
        app.delete(`${uri}/blog/:blogid/comment/:commentid`, this.deleteComment.bind(this));

        //#endregion
    }
    //#region Models

    async loginModel(req, res) {
        let model = new this.blogService.DTO.LoginDTO();
        this.sendData(res, model.postModel());
    }

    async registerModel(req, res) {
        let model = new this.blogService.DTO.RegisterDTO();
        this.sendData(res, model.postModel());
    }

    async whoAmIModel(req, res) {
        this.sendData(res, new this.blogService.DTO.WhoAmIDTO());
    }

    async whoModel(req, res) {
        this.sendData(res, [new this.blogService.DTO.WhoAmIDTO()]);
    }

    async getAllModel(req, res) {
        this.sendData(res, [new this.blogService.DTO.BlogDTO()]);
    }

    async getBlogModel(req, res) {
        this.sendData(res, new this.blogService.DTO.FullBlogDTO());
    }

    async postBlogModel(req, res) {
        let model = new this.blogService.DTO.BlogDTO();
        this.sendData(res, model.postModel());
    }

    async putBlogModel(req, res) {
        let model = new this.blogService.DTO.BlogDTO();
        this.sendData(res, model.putModel());
    }


    async postCommentModel(req, res) {
        let model = new this.blogService.DTO.BlogCommentDTO();
        this.sendData(res, model.postModel());
    }

    async putCommentModel(req, res) {
        let model = new this.blogService.DTO.BlogCommentDTO();
        this.sendData(res, model.putModel());
    }
    //#endregion

    //#region Login
    async login(req, res) {
        let loginDTO = new this.blogService.DTO.LoginDTO();
        this.loadDTOFromBody(loginDTO, req.body);
        const description = JSON.stringify({
            ip: req.ip,
            agent: req.useragent
        });
        var errors = [];
        var whoAmIDTO = await this.blogService.login(loginDTO, description, errors);
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

    async register(req, res) {
        let registerDTO = new this.blogService.DTO.RegisterDTO();
        this.loadDTOFromBody(registerDTO, req.body);
        var errors = [];
        var registerResult = await this.blogService.register(registerDTO, errors);
        if (registerResult) {
            this.sendCreated(res, {
                ok: true,
                message: "New user registered successfully!"
            });
        } else {
            this.sendError(res, this.ST_BadRequest, "register()", errors);
        }
    }


    async getLoggedUser(req, res) {
        this.sendData(res, req.currentLogin);
    }

    async getLoggedUsers(req, res) {
        this.sendData(res, req.app.currentLogins);
    }
    //#endregion



    async getAll(req, res) {
        console.log(`API ${this.nameAPI}: getAll(): `);
        //Normalize filterValues from query
        const filter = {};
        let recordDAO = new this.blogService.DAO.PostDAO();
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
            const recordsDTO = await this.blogService.getAll(filter, errors);
            if (recordsDTO) {
                this.sendData(res, recordsDTO);
            } else {
                this.sendError(res, this.ST_BadRequest, "getAll()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "getAll()", err.message);
        };
    }

    async getBlog(req, res) {
        console.log(`API ${this.nameAPI}: getBlog(): `);
        const blogId = req.params.blogid;
        try {
            const errors = [];
            const blogDTO = await this.blogService.getOne(blogId, errors);
            if (blogDTO) {
                this.sendData(res, blogDTO)
            } else {
                this.sendError(res, this.ST_NotFound, "getBlog()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "getBlog()", err.message);
        };
    }

    async newBlog(req, res) {
        console.log(`API blog newBlog()`);
        const authorid = req.currentLogin.userId;
        let blogDTO = new this.blogService.DTO.BlogDTO();
        blogDTO = blogDTO.postModel();
        this.loadDTOFromBody(blogDTO, req.body);
        try {
            const errors = [];
            blogDTO = await this.blogService.newBlog(authorid, blogDTO, errors);
            if (blogDTO) {
                this.sendData(res, blogDTO)
            } else {
                this.sendError(res, this.ST_BadRequest, "newBlog()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "newBlog()", err.message);
        };
    }

    async updateBlog(req, res) {
        console.log(`API blog updateBlog()`);
        const updaterId = req.currentLogin.userId;
        const blogId = req.params.blogid;
        let blogDTO = new this.blogService.DTO.BlogDTO();
        blogDTO = blogDTO.putModel();
        this.loadDTOFromBody(blogDTO, req.body);
        try {
            const errors = [];
            blogDTO = await this.blogService.updateBlog(updaterId, blogDTO, blogId, errors);
            if (blogDTO) {
                this.sendData(res, blogDTO)
            } else {
                this.sendError(res, this.ST_BadRequest, "updateBlog()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "updateBlog()", err.message);
        };
    }


    async deleteBlog(req, res) {
        console.log(`API blog deleteBlog()`);
        const updaterId = req.currentLogin.userId;
        const blogId = req.params.blogid;
        try {
            const errors = [];
            const deleteResult = await this.blogService.deleteBlog(updaterId, blogId, errors);
            if (deleteResult) {
                this.sendData(res, {
                    ok: true,
                    message: "Blog deleted successfully!"
                });
            } else {
                this.sendError(res, this.ST_NotFound, "deleteBlog()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "deleteBlog()", err.message);
        };
    }

    async newComment(req, res) {
        console.log(`API blog newComment()`);
        const updaterId = req.currentLogin.userId;
        const blogId = req.params.blogid;
        try {
            var errors = [];
            var blogCommentDTO = new this.blogService.DTO.BlogCommentDTO();
            blogCommentDTO = blogCommentDTO.postModel();
            this.loadDTOFromBody(blogCommentDTO, req.body);
            blogCommentDTO = await this.blogService.newComment(updaterId, blogId, blogCommentDTO, errors);
            if (blogCommentDTO) {
                this.sendData(res, blogCommentDTO)
            } else {
                this.sendError(res, this.ST_BadRequest, "newComment()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "newComment()", err.message);
        };
    }


    async updateComment(req, res) {
        console.log(`API blog updateComment()`);
        const updaterId = req.currentLogin.userId;
        const blogId = req.params.blogid;
        const commentId = req.params.commentid;
        try {
            var errors = [];
            var blogCommentDTO = new this.blogService.DTO.BlogCommentDTO();
            blogCommentDTO = blogCommentDTO.putModel();
            this.loadDTOFromBody(blogCommentDTO, req.body);
            const blogDTO = await this.blogService.updateComment(updaterId, blogId, blogCommentDTO, commentId, errors);
            if (blogDTO) {
                this.sendData(res, blogDTO)
            } else {
                this.sendError(res, this.ST_NotFound, "updateComment()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "updateComment()", err.message);
        };
    }

    async deleteComment(req, res) {
        console.log(`API blog removeComment()`);
        const updaterId = req.currentLogin.userId;
        const blogId = req.params.blogid;
        const commentId = req.params.commentid;
        try {
            var errors = [];
            const blogDTO = await this.blogService.deleteComment(updaterId, blogId, commentId, errors);
            if (blogDTO) {
                this.sendData(res, blogDTO)
            } else {
                this.sendError(res, this.ST_NotFound, "removeComment()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "removeComment()", err.message);
        };
    }

}

module.exports = BlogAPI;