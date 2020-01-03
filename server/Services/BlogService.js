const BaseService = require('./BaseService');

class BlogService extends BaseService {
    constructor(services) {
        super();
        this.nameService = 'blogService';
        this.services = services.services;
        this.DAO = services.DAO;
        this.DTO = services.DTO;
    }

    /*
            app.get(`${uri}/blog`, this.getAll.bind(this));
            app.get(`${uri}/blog/:blogid`, this.getOne.bind(this));

            app.post(`${uri}/blog/:authorid`, this.newBlog.bind(this));
            app.put(`${uri}/blog/:blogid`, this.updateBlog.bind(this));
            app.delete(`${uri}/blog/:blogid`, this.deleteBlog.bind(this));

            app.post(`${uri}/blog/:blogid/comment/:authorid`, this.newComment.bind(this));
            app.put(`${uri}/blog/:blogid/comment/:commentid`, this.updateComment.bind(this));
            app.delete(`${uri}/blog/comment/:commentid`, this.deleteComment.bind(this));

    */


    async login(email, password, description, errors) {
        if (!email) {
            errors.push("email mandatory");
        } else if (!password) {
            errors.push("password mandatory");
        } else {
            var users = await this.findUsersByEmail(email);
            if (users.length == 0) {
                errors.push("email not found");
            } else if (users.length > 1) {
                errors.push("invalid email");
            } else {
                var result = await this.matchPassword(users[0].id, password);
                if (!result) {
                    errors.push("invalid password");
                } else {
                    var errors = [];
                    var bearerDTO = await this.createBearer(users[0].id, description, errors);
                    if (bearerDTO) {
                        return bearerDTO;
                    }
                }
            }
        }
        return null;
    }



    async createBearer(userId, description, errors) {
        try {
            var filter = {
                userId: userId,
                description: description
            };
            var bearersDAO = await this.DAO.BearerDAO.find(filter);
            var bearerDAO;
            if (bearersDAO) {
                if (bearersDAO.length > 0) {
                    bearerDAO = bearersDAO[0];
                }
            }
            if (!bearerDAO) {
                bearerDAO = new this.DAO.BearerDAO();
                var until = new Date();
                until.setFullYear(until.getFullYear() + 1);
                bearerDAO.userId = userId;
                bearerDAO.description = description;
                bearerDAO.validUntil = until;
                bearerDAO = await bearerDAO.save();
            }
            var bearerDTO = new this.DTO.BearerDTO();
            bearerDTO.fromDAO(bearerDAO);
            return bearerDTO;
        } catch (err) {
            errors.push(err.message);
        }
        return null;
    }

    async getAll(filter, errors) {
        return await this.services.postsService.readAll(filter, errors);
    }

    async getOne(blogId, errors) {
        return await this.services.postsService.readFullOne(blogId, errors);
    }


    async checkAuthor(authorId, errors) {
        let authorDAO = await this.DAO.UserDAO.findById(authorId);
        if (!authorDAO) {
            errors.push(`Author '${authorId}' not found`);
            return null;
        }
        if (authorDAO.isBlocked) {
            errors.push(`Author '${authorId}' is blocked`);
            return null;
        }
        if (!authorDAO.isAuthor) {
            errors.push(`Author '${authorId}' is not an author`);
            return null;
        }
        return authorDAO;
    }

    async newBlog(authorId, errors) {
        //Check author
        let authorDAO = await this.checkAuthor(authorId, errors);
        if (!authorDAO) {
            return;
        }
        //add new post with field authorId = param
        let postDTO = new this.DTO.PostDTO();
        postDTO.postTitle = "New Post";
        postDTO.postText = "";
        postDTO.authorId = authorId;
        postDTO = await this.services.postsService.createOne(postDTO, errors);
        if (postDTO) {
            return await this.services.postsService.readFullOne(postDTO.id, errors);
        }
        return null;
    }

    async updateBlog(updaterId, body, blogId, errors) {
        //Check updater
        let updaterDAO = await this.checkAuthor(updaterId, errors);
        if (!updaterDAO) {
            return;
        }
        let postDAO = await this.DAO.PostDAO.findById(blogId);
        if (!postDAO) {
            errors.push(`Blog '${blogId}' not found`);
            return null;
        }
        if (!updaterDAO.isAdmin) {
            if (updaterDAO._id !== postDAO.authorId) {
                errors.push(`You're not the author of the post '${blogId}'`);
                return null;
            }
        }
        let postDTO = new this.DTO.PostDTO();
        postDTO.fromDAO(postDAO);
        postDTO.fromDAO(body);
        postDTO.lastUpdate = new Date();

        postDTO = await this.services.postsService.updateOne(postDTO, blogId, errors);
        if (postDTO) {
            return await this.services.postsService.readFullOne(postDTO.id, errors);
        }
        return null;
    }

    async deleteBlog(updaterId, blogId, errors) {
        //Check updater
        let updaterDAO = await this.checkAuthor(updaterId, errors);
        if (!authorDAO) {
            return;
        }
        let blogDTO = await this.services.postsService.readOne(blogId, errors);
        if (!blogDTO) {
            errors.push(`Blog '${blogId}' not found`);
            return null;
        }
        if (!updaterDAO.isAdmin) {
            if (updaterDAO._id !== blogDTO.authorId) {
                errors.push(`You're not the author of the post '${blogId}'`);
                return null;
            }
        }
        //Delete comments
        let filter = {
            postId: blogId
        };
        let deleteManyResult = await this.DAO.CommentDAO.deleteMany({
            filter
        });
        if (!deleteManyResult) {
            errors.push(`error removing comments for this blog`);
            return null;
        }
        if (!deleteManyResult.ok) {
            errors.push(`error removing comments for this blog`);
            return null;
        }
        //delete Blog
        return await this.services.postsService.deleteOne(blogId, errors);
    }

    async newComment(authorId, blogId, commentDTO, errors) {
        //Check author
        let authorDAO = await this.checkAuthor(authorId, errors);
        if (!authorDAO) {
            return;
        }
        let postDAO = await this.DAO.PostDAO.findById(blogId);
        if (!postDAO) {
            errors.push(`Blog '${blogId}' not found`);
            return null;
        }
        if (!authorDAO.isAdmin) {
            if (authorDAO._id !== postDAO.authorId) {
                errors.push(`You're not the author of the post '${blogId}'`);
                return null;
            }
        }
        commentDTO.postId = blogId;
        commentDTO.userId = authorId;
        commentDTO.commentDate = new Date();
        commentDTO = await this.services.commentsService.createOne(commentDTO, errors);
        if (!commentDTO) {
            return null;
        }
        return this.services.commentsService.readFullOne(commentDTO.id, errors);
    }

    async updateComment(updaterId, blogId, commentDTO, commentId, errors) {
        //Check updater
        let updaterDAO = await this.checkAuthor(updaterId, errors);
        if (!authorDAO) {
            return;
        }
        let currentCommentDTO = await this.services.commentsService.readOne(commentId, errors);
        if (!currentCommentDTO) {
            errors.push(`Comment '${commentId}' not found`);
            return null;
        }

        if (currentCommentDTO.postId != blogId) {
            errors.push(`This comment '${commentId}' doesn't belong to this post`);
            return null;
        }
        if (!updaterDAO.isAdmin) {
            if (updaterDAO._id != currentCommentDTO.userId) {
                errors.push(`You're not the author of the comment '${commentId}'`);
                return null;
            }
        }
        currentCommentDTO.commentText = commentDTO.commentText;
        currentCommentDTO.userId = commentDTO.userId;
        currentCommentDTO, lastUpdate = new Date();

        commentDTO = await this.services.commentsService.updateOne(currentCommentDTO, commentId, errors);
        if (commentDTO) {
            return await this.services.commentsService.readFullOne(commentDTO.id, errors);
        }
        return null;
    }

    async deleteComment(updaterId, blogId, commentId, errors) {
        //Check updater
        let updaterDAO = await this.checkAuthor(updaterId, errors);
        if (!authorDAO) {
            return;
        }
        let commentDTO = await this.services.commentsService.readOne(commentId, errors);
        if (!commentDTO) {
            errors.push(`Comment '${commentId}' not found`);
            return null;
        }
        if (commentDTO.postId != blogId) {
            errors.push(`This comment '${commentId}' doesn't belong to this post`);
            return null;
        }
        if (!updaterDAO.isAdmin) {
            if (updaterDAO._id != commentDTO.userId) {
                errors.push(`You're not the author of the comment '${commentId}'`);
                return null;
            }
        }
        return await this.services.postsService.deleteOne(commentId, errors);
    }

    //#region Aux methods
    async findUsersByEmail(email, errors) {
        return this.services.usersService.findUsersByEmail(email, errors);
    }

    async matchPassword(id, password) {
        return this.services.usersService.matchPassword(id, password);
    }
    //#endregion


}


module.exports = BlogService;