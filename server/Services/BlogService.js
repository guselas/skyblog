const BaseService = require('./BaseService');
const fetch = require('node-fetch');

class BlogService extends BaseService {
    constructor(services) {
        super();
        this.nameService = 'blogService';
        this.services = services.services;
        this.DAO = services.DAO;
        this.DTO = services.DTO;
        this.badWords = [{}, {}, {}, {}, {}, {}];
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


    async login(loginDTO, description, errors) {
        if (!loginDTO.email) {
            errors.push("email is mandatory");
        } else if (!loginDTO.password) {
            errors.push("password is mandatory");
        } else {
            var users = await this.findUsersByEmail(loginDTO.email);
            if (users.length == 0) {
                errors.push("email not found");
            } else if (users.length > 1) {
                errors.push("invalid email");
            } else {
                var result = await this.matchPassword(users[0].id, loginDTO.password);
                if (!result) {
                    errors.push("invalid password");
                } else {
                    var errors = [];
                    var bearerDTO = await this.createBearer(users[0].id, description, errors);
                    if (bearerDTO) {
                        let userDAO = await this.DAO.UserDAO.findById(bearerDTO.userId);
                        if (userDAO) {
                            userDAO.lastLogin = new Date();
                            await userDAO.save();
                            let whoAmIDTO = new this.DTO.WhoAmIDTO();
                            whoAmIDTO.fromDAO(userDAO);
                            whoAmIDTO.fromDAO(bearerDTO);
                            return whoAmIDTO;
                        }
                    }
                }
            }
        }
        return null;
    }

    async register(registerDTO, errors) {
        if (!registerDTO.email) {
            errors.push("email is mandatory");
        } else
        if (!registerDTO.nickName) {
            errors.push("NickName is mandatory");
        } else
        if (!registerDTO.password) {
            errors.push("password is mandatory");
        } else {
            let userDTO = new this.DTO.UserDTO();
            userDTO.fromDAO(registerDTO);
            userDTO = await this.services.usersService.createOne(userDTO, errors);
            if (userDTO) {
                return userDTO;
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
                bearerDAO.lastAccess = new Date();
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

    async getAll(level, filter, sorter, pageSize, pageIndex, errors) {
        let postsDTO = await this.services.postsService.readAll(filter, sorter, pageSize, pageIndex, errors);
        let blogsDTO = [];
        for (let postDTO of postsDTO) {
            let ok = true;
            //Filter level
            if (level) {
                ok = this.validateText(this.badWords, [postDTO.postText, postDTO.postTitle].join(" "), level);
            }
            //Filter passed
            if (ok) {
                let blogDTO = new this.DTO.BlogDTO();
                let userDAO = await this.DAO.UserDAO.findById(postDTO.userId);
                if (userDAO) {
                    blogDTO.fromDAO(userDAO);
                }
                //Find Comments
                var comments = await this.DAO.CommentDAO.find({
                    postId: postDTO.id
                }).limit(1);
                if (comments) {
                    blogDTO.hasComments = (comments.length > 0);
                }
                //Fill post Fields
                blogDTO.fromDAO(postDTO);
                blogsDTO.push(blogDTO);
            }
        }
        return blogsDTO;
    }

    async getBadWordsCount(level, filter, errors) {
        if (!level) {
            level = 5;
        }
        filter.level = {
            $lte: level
        };
        let count = await this.services.badWordsService.recordsCount(filter, errors);
        if (count) {
            return count;
        }
        return null;
    }

    async getBadWords(level, filter, errors) {
        if (!level) {
            level = 5;
        }
        filter.level = {
            $lte: level
        };
        let badWordsDAO = await this.DAO.BadWordDAO.find(filter);
        if (badWordsDAO) {
            let result = badWordsDAO.map((item) => item.word);
            return result;
        }
        return null;
    }

    async getOne(blogId, errors) {
        //we create the result variable
        let blogDTO = new this.DTO.BlogDTO();

        //we look for the blogHeader fields
        let postDAO = await this.DAO.PostDAO.findById(blogId);
        if (!postDAO) {
            errors.push(`blogId "${blogId}" not found`);
        } else {
            //we look for the complementary blogDTO fields
            let userDAO = await this.DAO.UserDAO.findById(postDAO.authorId);
            if (userDAO) {
                blogDTO.fromDAO(userDAO);
            }
            //Find Comments
            var comments = await this.DAO.CommentDAO.find({
                postId: postDAO._id
            });
            if (comments) {
                blogDTO.hasComments = (comments.length > 0);
                let blogCommentsDTO = [];
                for (let comment of comments) {
                    let blogCommentDTO = new this.DTO.BlogCommentDTO();
                    //we load the user fields 
                    userDAO = await this.DAO.UserDAO.findById(comment.userId);
                    if (userDAO) {
                        blogCommentDTO.fromDAO(userDAO);
                    }
                    //we load the comment fields
                    blogCommentDTO.fromDAO(comment);
                    //we push into result
                    blogCommentsDTO.push(blogCommentDTO);
                }
                //we load the full comments 
                blogDTO.comments = blogCommentsDTO;
            }
            //Fill post Fields
            blogDTO.fromDAO(postDAO);

            return blogDTO;
        }
        return null;
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

    async newBlog(authorId, blogDTO, errors) {
        if (!this.validateText(this.badWords, blogDTO.postTitle + " " + blogDTO.postText, 5)) {
            errors.push(`Post too offensive`);
            return null;
        }
        //Check author
        let authorDAO = await this.checkAuthor(authorId, errors);
        if (!authorDAO) {
            return null;
        }
        //add new post with field authorId = param

        let postDTO = new this.DTO.PostDTO();
        postDTO.fromDAO(blogDTO);
        postDTO.authorId = authorId;
        postDTO = await this.services.postsService.createOne(postDTO, errors);
        if (postDTO) {
            return await this.getOne(postDTO.id, errors);
        }
        return null;
    }

    async updateBlog(updaterId, blogDTO, blogId, errors) {
        if (!this.validateText(this.badWords, blogDTO.postTitle + " " + blogDTO.postText, 5)) {
            errors.push(`Post too offensive`);
            return null;
        }
        //Check updater
        let updaterDAO = await this.checkAuthor(updaterId, errors);
        if (!updaterDAO) {
            return null;
        }
        let postDTO = await this.services.postsService.readOne(blogId, errors);
        if (!postDTO) {
            errors.push(`Blog '${blogId}' not found`);
            return null;
        }
        if (!updaterDAO.isAdmin) {
            if (updaterDAO._id !== postDTO.authorId) {
                errors.push(`You're not the author of the post '${blogId}'`);
                return null;
            }
        }
        postDTO.fromDAO(blogDTO);
        postDTO.lastUpdate = new Date();
        postDTO = await this.services.postsService.updateOne(postDTO, blogId, errors);
        if (postDTO) {
            return await this.getOne(blogId, errors);
        }
        return null;
    }

    async deleteBlog(updaterId, blogId, errors) {
        //Check updater
        let updaterDAO = await this.checkAuthor(updaterId, errors);
        if (!updaterDAO) {
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

    async newComment(authorId, blogId, blogCommentDTO, errors) {
        if (!this.validateText(this.badWords, blogCommentDTO.commentText, 5)) {
            errors.push(`Comment too offensive`);
            return null;
        }
        //Check author
        let authorDAO = await this.checkAuthor(authorId, errors);
        if (!authorDAO) {
            return null;
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
        let commentDTO = new this.DTO.CommentDTO();
        commentDTO.fromDAO(blogCommentDTO);
        commentDTO.postId = blogId;
        commentDTO.userId = authorId;
        commentDTO = await this.services.commentsService.createOne(commentDTO, errors);
        if (!commentDTO) {
            return null;
        }
        return await this.getOne(blogId, errors);
    }

    async updateComment(updaterId, blogId, blogCommentDTO, commentId, errors) {
        if (!this.validateText(this.badWords, blogCommentDTO.commentText, 5)) {
            errors.push(`Comment too offensive`);
            return null;
        }
        //Check updater
        let updaterDAO = await this.checkAuthor(updaterId, errors);
        if (!updaterDAO) {
            return null;
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
        currentCommentDTO.fromDAO(blogCommentDTO);
        currentCommentDTO.lastUpdate = new Date();

        currentCommentDTO = await this.services.commentsService.updateOne(currentCommentDTO, commentId, errors);
        if (currentCommentDTO) {
            return await this.getOne(blogId, errors);
        }
        return null;
    }

    async deleteComment(updaterId, blogId, commentId, errors) {
        //Check updater
        let updaterDAO = await this.checkAuthor(updaterId, errors);
        if (!updaterDAO) {
            return null;
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
        if (await this.services.commentsService.deleteOne(commentId, errors)) {
            return await this.getOne(blogId, errors);
        }
        return null;
    }

    //#region Aux methods

    loadBadWords(fileName) {
        let badWords = [{}, {}, {}, {}, {}, {}];
        var data = require(fileName);
        for (let item of data) {
            switch (item.level) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    badWords[item.level][item.word] = true;
                    break;
            }
        }
        return badWords;
    }

    async seedBadWords() {
        //if the database is empty we load badwords from assets/badwords2.json
        let badWordsDAO = await this.DAO.BadWordDAO.find({}).limit(1);
        if (badWordsDAO) {
            if (badWordsDAO.length == 0) {
                var data = require('../assets/badWords2.json');
                for (let item of data) {
                    let badWordDAO = new this.DAO.BadWordDAO();
                    badWordDAO.word = item.word.trim().toLowerCase();
                    badWordDAO.level = item.level;
                    await badWordDAO.save();
                }
            }
        }
        //we classify all the database badwords into blogService.badWords array for each level containing their badwords. 
        badWordsDAO = await this.DAO.BadWordDAO.find({});
        for (let badWordDAO of badWordsDAO) {
            switch (badWordDAO.level) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    this.badWords[badWordDAO.level][badWordDAO.word] = true;
                    break;

            }
        }

    }

    async seed() {
        //seed bad Words
        await this.seedBadWords()
    }

    async findUsersByEmail(email, errors) {
        return this.services.usersService.findUsersByEmail(email, errors);
    }

    async matchPassword(id, password) {
        return this.services.usersService.matchPassword(id, password);
    }

    validateText(badWords, value, level) {
        if (level > 5) {
            level = 5;
        }
        if (level < 0) {
            level = 0;
        }
        value = value.toLowerCase();
        let words = value.split(/[;!:, ]/).filter(Boolean);
        for (let word of words) {
            for (let n = 0; n <= level; n++) {
                if (word in badWords[n]) {
                    return false;
                }
            }
        }
        return true;
    }
    //#endregion
}


module.exports = BlogService;