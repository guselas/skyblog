const {
    BaseAPI,
    DataBrowseAPI
} = require('./BaseAPI');

class BlogAPI extends BaseAPI {
    constructor(uri, app, blogMW, services) {
        super(uri, app, 'Blog');
        this.blogService = services.blogService;

        //#region Endpoints Model
        app.get(`${uri}/blog/login/model`, this.loginModel.bind(this));
        app.get(`${uri}/blog/register/model`, this.registerModel.bind(this));
        app.get(`${uri}/blog/profile/model`, this.profileModel.bind(this));
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
        app.put(`${uri}/blog/profile`, blogMW.isAuthenticated.bind(blogMW), this.updateProfile.bind(this));
        app.get(`${uri}/blog/profile`, blogMW.isAuthenticated.bind(blogMW), this.getProfile.bind(this));

        app.post(`${uri}/blog/badwords`, blogMW.isAdmin.bind(blogMW), this.addBadWord.bind(this));
        app.put(`${uri}/blog/badwords/:badwordid`, blogMW.isAdmin.bind(blogMW), this.updateBadWord.bind(this));
        app.delete(`${uri}/blog/badwords/:badwordid`, blogMW.isAdmin.bind(blogMW), this.deleteBadWord.bind(this));

        app.get(`${uri}/blog/badwords/count`, blogMW.isAdmin.bind(blogMW), this.getBadWordsCount.bind(this));
        app.get(`${uri}/blog/badwords`, blogMW.isAdmin.bind(blogMW), this.getBadWords.bind(this));

        app.get(`${uri}/blog`, this.getAll.bind(this));
        app.get(`${uri}/blog/:blogid`, this.getBlog.bind(this));

        app.post(`${uri}/blog`, blogMW.isAuthor.bind(blogMW), this.newBlog.bind(this));
        app.put(`${uri}/blog/:blogid`, blogMW.isAuthor.bind(blogMW), this.updateBlog.bind(this));
        app.delete(`${uri}/blog/:blogid`, blogMW.isAuthor.bind(blogMW), this.deleteBlog.bind(this));

        app.post(`${uri}/blog/:blogid/comment`, blogMW.isAuthor.bind(blogMW), this.newComment.bind(this));
        app.put(`${uri}/blog/:blogid/comment/:commentid`, blogMW.isAuthor.bind(blogMW), this.updateComment.bind(this));
        app.delete(`${uri}/blog/:blogid/comment/:commentid`, blogMW.isAuthor.bind(blogMW), this.deleteComment.bind(this));

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

    async profileModel(req, res) {
        this.sendData(res, new this.blogService.DTO.ProfileDTO());
    }

    async whoModel(req, res) {
        this.sendData(res, [new this.blogService.DTO.ProfileDTO()]);
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
        var tokenJWT = await this.blogService.login(loginDTO, description, errors);
        if (tokenJWT) {
            this.sendData(res, {
                Authorization: `Bearer ${tokenJWT}`
            });
        } else {
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

    async updateProfile(req, res) {
        let errors = [];
        let registerDTO = new this.blogService.DTO.RegisterDTO();
        registerDTO.postModel();
        this.loadDTOFromBody(registerDTO, req.body);
        var userDTO = await this.blogService.updateProfile(req.userDAO._id, registerDTO, errors);
        if (userDTO) {
            this.sendData(res, userDTO);
        } else {
            this.sendError(res, this.ST_Conflict, errors);
        }
    }

    async getProfile(req, res) {
        let profileDTO = new this.blogService.DTO.ProfileDTO();
        profileDTO.fromDAO(req.userDAO);
        this.sendData(res, profileDTO);
    }

    //#endregion

    //#region Blog
    async getAll(req, res) {
        console.log("req", req);
        console.log("req.body", req.body);
        console.log(`API ${this.nameAPI}: getAll(): `);
        //Normalize filterValues from query
        let level = !req.query.level ? 5 : req.query.level;
        let pageSize = !req.query.pageSize ? 10 : req.query.pageSize;
        let pageIndex = !req.query.pageIndex ? 0 : req.query.pageIndex;
        let sorter = {};
        if (req.query.orderBy) {
            sorter[req.query.orderBy] = 1;
        }
        if (req.query.orderByDesc) {
            sorter[req.query.orderByDesc] = -1;
        }
        const filter = this.getFilterFromQuery(req);
        try {
            let errors = [];
            const totalRecords = await this.blogService.postsCount(level, filter, errors);
            const recordsDTO = await this.blogService.getAll(level, filter, sorter, pageSize, pageIndex, errors);
            if (recordsDTO) {
                let dataBrowseAPI = new DataBrowseAPI();
                dataBrowseAPI.level = level;
                dataBrowseAPI.filter = filter;
                dataBrowseAPI.sorter = sorter;
                dataBrowseAPI.pageSize = pageSize;
                dataBrowseAPI.pageIndex = pageIndex;
                dataBrowseAPI.totalRecords = totalRecords;
                dataBrowseAPI.data = recordsDTO;
                this.sendData(res, dataBrowseAPI);
            } else {
                this.sendError(res, this.ST_BadRequest, "getAll()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "getAll()", err.message);
        };
    }

    async getBadWordsCount(req, res) {
        console.log(`API ${this.nameAPI}: getBadWordsCount(): `);
        //Normalize filterValues from query
        let level = req.query.level;
        const filter = {};
        let obj = new this.blogService.DTO.BadWordDTO().postModel();
        for (let prop in req.query) {
            if (prop in obj) {
                let value = obj[prop];
                if (typeof value == "string") {
                    filter[prop] = {
                        $regex: req.query[prop]
                    };
                } else if (value instanceof Date) {
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
        try {
            let errors = [];
            const count = await this.blogService.getBadWordsCount(level, filter, errors);
            if (count) {
                this.sendData(res, {
                    total: count
                });
            } else {
                this.sendError(res, this.ST_BadRequest, "getBadWordsCount()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "getBadWordsCount()", err.message);
        };
    }

    async getBadWords(req, res) {
        console.log(`API ${this.nameAPI}: getBadWords(): `);
        //Normalize filterValues from query
        let level = req.query.level;
        const filter = {};
        let obj = new this.blogService.DTO.BadWordDTO().postModel();
        for (let prop in req.query) {
            if (prop in obj) {
                let value = obj[prop];
                if (typeof value == "string") {
                    filter[prop] = {
                        $regex: req.query[prop]
                    };
                } else if (value instanceof Date) {
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
        try {
            let errors = [];
            const badWords = await this.blogService.getBadWords(level, filter, errors);
            if (badWords) {
                this.sendData(res, badWords);
            } else {
                this.sendError(res, this.ST_BadRequest, "getBadWords()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "getBadWords()", err.message);
        };
    }

    async addBadWord(req, res) {
        console.log(`API blog addBadWord()`);
        try {
            var errors = [];
            var badWordDTO = new this.blogService.DTO.BadWordDTO();
            badWordDTO = badWordDTO.postModel();
            this.loadDTOFromBody(badWordDTO, req.body);
            badWordDTO = await this.blogService.addBadWord(badWordDTO, errors);
            if (badWordDTO) {
                this.sendData(res, badWordDTO)
            } else {
                this.sendError(res, this.ST_BadRequest, "addBadWord()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "addBadWord()", err.message);
        };
    }

    async updateBadWord(req, res) {
        console.log(`API blog updateBadWord()`);
        const badWordId = req.params.badWordid;
        try {
            var errors = [];
            var badWordDTO = new this.blogService.DTO.BadWordDTO();
            badWordDTO = badWordDTO.putModel();
            this.loadDTOFromBody(badWordDTO, req.body);
            badWordDTO = await this.blogService.updateBadWord(badWordDTO, badWordId, errors);
            if (badWordDTO) {
                this.sendData(res, badWordDTO)
            } else {
                this.sendError(res, this.ST_NotFound, "updateBadWord()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "updateBadWord()", err.message);
        };
    }

    async deleteBadWord(req, res) {
        console.log(`API blog deleteBadWord()`);
        const badWordId = req.params.badWordid;
        try {
            var errors = [];
            const badWordDTO = await this.blogService.deleteBadWord(badWordId, errors);
            if (badWordDTO) {
                this.sendData(res, badWordDTO)
            } else {
                this.sendError(res, this.ST_NotFound, "deleteBadWord()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "deleteBadWord()", err.message);
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
        const authorid = req.userDAO._id;
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
        const updaterId = req.userDAO._id;
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
        const updaterId = req.userDAO._id;
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
        const updaterId = req.userDAO._id;
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
        const updaterId = req.userDAO._id;
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
        const updaterId = req.userDAO._id;
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

    getFilterFromQuery(req) {
        const filter = {};
        let obj = new this.blogService.DTO.PostDTO().postModel();
        for (let prop in req.query) {
            if (prop in obj) {
                let value = obj[prop];
                if (typeof value == "string") {
                    filter[prop] = {
                        $regex: req.query[prop]
                    };
                } else if (value instanceof Date) {
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
    //#endregion
}

module.exports = BlogAPI;