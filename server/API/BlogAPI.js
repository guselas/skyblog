const BaseAPI = require('./BaseAPI');

class BlogAPI extends BaseAPI {
    constructor(uri, app, services) {
        super(uri, app, 'Blog');
        this.blogService = services.blogService;

        //#region Endpoints Model
        app.get(`${uri}/blog/model/login`, this.loginModel.bind(this));
        app.get(`${uri}/blog/model/currentuser`, this.currentUserModel.bind(this));

        app.get(`${uri}/blog/model/all`, this.getAllModel.bind(this));
        app.get(`${uri}/blog/model`, this.getBlogModel.bind(this));
        app.get(`${uri}/blog/model/post`, this.newBlogModel.bind(this));
        app.get(`${uri}/blog/model/put`, this.updateBlogModel.bind(this));
        app.get(`${uri}/blog/model/delete`, this.deleteBlogModel.bind(this));

        app.get(`${uri}/blog/comment/model/post`, this.newCommentModel.bind(this));
        app.get(`${uri}/blog/comment/model/put`, this.updateCommentModel.bind(this));
        app.get(`${uri}/blog/comment/model/delete`, this.deleteCommentModel.bind(this));
        //#endregion
        //#region Endpoints BlogApp

        app.post(`${uri}/blog/login`, this.login.bind(this));
        app.get(`${uri}/blog/whoami`, this.getLoggedUser.bind(this));

        app.get(`${uri}/blog`, this.getAll.bind(this));
        app.get(`${uri}/blog/:blogid`, this.getBlog.bind(this));

        app.post(`${uri}/blog`, this.newBlog.bind(this));
        app.put(`${uri}/blog/:blogid`, this.updateBlog.bind(this));
        app.delete(`${uri}/blog/:blogid`, this.deleteBlog.bind(this));

        app.post(`${uri}/blog/:blogid/comment`, this.newComment.bind(this));
        app.put(`${uri}/blog/:blogid/comment/:commentid`, this.updateComment.bind(this));
        app.delete(`${uri}/blog/comment/:commentid`, this.deleteComment.bind(this));

        //#endregion
    }
    //#region Models

    async loginModel(req, res) {
        this.sendData(res, {
            email: "email",
            password: "password"
        });
    }

    async currentUserModel(req,res){

    }

    async getAllModel(req,res){

    }

    async getBlogModel(req,res){

    }

    async newBlogModel(req,res){

    }

    async updateBlogModel(req,res){

    }

    async deleteBlogModel(req,res){

    }

    async newCommentModel(req,res){

    }

    async updateCommentModel(req,res){

    }

    async deleteCommentModel(req,res){

    }
    //#endregion

    //#region Login
    async login(req, res) {
        const email = req.body.email;
        const password = req.body.password;
        const description = JSON.stringify({
            ip: req.ip,
            agent: req.useragent
        });
        var errors = [];
        var bearerDTO = await this.blogService.login(email, password, description, errors);
        if (bearerDTO) {
            this.sendData(res, {
                Authorization: `Bearer ${bearerDTO.id}`
            });
        } else {
            this.sendError(res, this.ST_Conflict, errors);
        }
    }

    async getLoggedUser(req, res) {
        var userDTO = new this.blogService.DTO.UserDTO();
        userDTO.fromDAO(req.currentUser);
        this.sendData(res, userDTO.putModel());
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
            const fullRecordDTO = await this.blogService.services.postsService.readFullOne(blogId, errors);
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
        const authorid = req.currentUser._id;
        try {
            const errors = [];
            const blogDTO = await this.blogService.newBlog(authorid, errors);
            if (blogDTO) {
                this.sendData(res, blogDTO)
            } else {
                this.sendError(res, this.ST_NotFound, "newBlog()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "newBlog()", err.message);
        };
    }

    async updateBlog(req, res) {
        console.log(`API blog updateBlog()`);
        const updaterId = req.currentUser._id;
        const blogId = req.params.blogid;
        try {
            const errors = [];
            let blogDTO = await this.blogService.updateBlog(updaterId, req.body, blogId, errors);
            if (blogDTO) {
                this.sendData(res, blogDTO)
            } else {
                this.sendError(res, this.ST_NotFound, "updateBlog()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "updateBlog()", err.message);
        };
    }


    async deleteBlog(req, res) {
        console.log(`API blog deleteBlog()`);
        const updaterId = req.currentUser._id;
        const blogId = req.params.blogid;
        try {
            const errors = [];
            const blogDTO = await this.blogService.deleteBlog(updaterId, blogId, errors);
            if (blogDTO) {
                this.sendData(res, blogDTO)
            } else {
                this.sendError(res, this.ST_NotFound, "deleteBlog()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "deleteBlog()", err.message);
        };
    }

    async newComment(req, res) {
        console.log(`API blog newComment()`);
        const updaterId = req.currentUser._id;
        const blogId = req.params.blogid;
        try {
            var errors = [];
            var commentDTO = new this.blogService.DTO.CommentDTO();
            this.loadDTOFromBody(commentDTO, req.body);
            const blogDTO = await this.blogService.newComment(updaterId, blogId, commentDTO, errors);
            if (blogDTO) {
                this.sendData(res, blogDTO)
            } else {
                this.sendError(res, this.ST_NotFound, "newComment()", errors);
            }
        } catch (err) {
            this.sendError(res, this.ST_InternalServerError, "newComment()", err.message);
        };
    }


    async updateComment(req, res) {
        console.log(`API blog updateComment()`);
        const updaterId = req.currentUser._id;
        const blogId = req.params.blogid;
        const commentId = req.params.commentid;
        try {
            var errors = [];
            var commentDTO = new this.blogService.DTO.CommentDTO();
            this.loadDTOFromBody(commentDTO, req.body);
            const blogDTO = await this.blogService.updateComment(updaterId, blogId, commentDTO, commentId, errors);
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
        const updaterId = req.currentUser._id;
        const blogId = req.params.blogid;
        const commentId = req.params.commentid;
        try {
            var errors = [];
            const blogDTO = await this.blogService.removeComment(updaterId, blogId, commentId, errors);
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