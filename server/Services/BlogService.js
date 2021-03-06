const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_KEY = 'secret-key';
const BaseService = require('./BaseService');
const Validator = require('../Validator/Validator');


class BlogService extends BaseService {
    constructor(services) {
        super();
        this.nameService = 'blogService';
        this.services = services.services;
        this.DAO = services.DAO;
        this.DTO = services.DTO;
        this.validator = null;
    }

    async checkValidator() {
        if (!this.validator) {
            this.validator = new Validator();
            await this.validator.loadBadWordsFromDB(this.DAO.BadWordDAO);
        }
    }

    async reloadValidator() {
        this.validator = null;
        await this.checkValidator();
    }

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
                    let userDAO = await this.DAO.UserDAO.findById(users[0].id);
                    if (userDAO) {
                        userDAO.lastLogin = new Date();
                        await userDAO.save();
                    }
                    let tokenJWT = jwt.sign({
                        _id: users[0].id
                    }, JWT_KEY, {
                        expiresIn: '24h'
                    })
                    return tokenJWT;
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

    async updateProfile(userId, registerDTO, errors) {
        let userDTO = await this.services.usersService.readOne(userId, errors);
        if (userDTO) {
            userDTO.fromDAO(registerDTO);
            userDTO = await this.services.usersService.updateOne(userDTO, userId, errors);
            if (userDTO) {
                return userDTO;
            }
        }
        return null;
    }

    async postsCount(level, filter, errors) {
        let count = 0;
        let postsDTO = await this.services.postsService.readAll(filter, errors);
        for (let postDTO of postsDTO) {
            let ok = true;
            //Filter level
            if (level) {
                let result = await this.validateText(level, [postDTO.postText, postDTO.postTitle].join(" "));
                ok = result.ok;
            }
            //Filter passed
            if (ok) {
                count++;
            }
        }
        return count;
    }

    async getCategories(errors) {
        let dict = {};
        let listCategories = [];
        let itemsDAO = await this.DAO.PostDAO.find({}, {
            _id: 0,
            category: 1
        });
        if (itemsDAO) {
            for (let item of itemsDAO) {
                dict[item.category] = true;
            }
            for (let category in dict) {
                listCategories.push(category);
            }
            listCategories.sort();
        }
        return listCategories;
    }

    async getAll(level, filter, sorter, pageSize, pageIndex, errors) {
        let postsDTO = await this.services.postsService.readAll(filter, sorter, pageSize, pageIndex, errors);
        let blogsDTO = [];
        for (let postDTO of postsDTO) {
            let ok = true;
            //Filter level
            if (level) {
                let result = await this.validateText(level, [postDTO.postText, postDTO.postTitle].join(" "));
                ok = result.ok;
            }
            //Filter passed
            if (ok) {
                let blogDTO = new this.DTO.BlogDTO();
                let userDAO = await this.DAO.UserDAO.findById(postDTO.authorId);
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
        let sorter = {
            word: 1
        };
        let badWordsDAO = await this.DAO.BadWordDAO.find(filter).sort(sorter);
        if (badWordsDAO) {
            let badwordsDTO = [];
            for (let badwordDAO of badWordsDAO) {
                let badwordDTO = new this.DTO.BadWordDTO();
                badwordDTO.fromDAO(badwordDAO);
                badwordsDTO.push(badwordDTO);
            }
            return badwordsDTO;
        }
        return null;
    }

    async addBadWord(badWordDTO, errors) {
        let result = this.services.badWordsService.createOne(badWordDTO, errors);
        await this.reloadValidator();
        return result;
    }

    async updateBadWord(badWordDTO, badWordId, errors) {
        let result = this.services.badWordsService.updateOne(badWordDTO, badWordId, errors);
        await this.reloadValidator();
        return result;

    }

    async deleteBadWord(badWordId, errors) {
        let result = this.services.badWordsService.deleteOne(badWordId, errors);
        await this.reloadValidator();
        return result;

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
            var commentsDAO = await this.DAO.CommentDAO.find({
                postId: postDAO._id
            });
            if (commentsDAO) {
                blogDTO.hasComments = (commentsDAO.length > 0);
                let blogCommentsDTO = [];
                for (let commentDAO of commentsDAO) {
                    let blogCommentDTO = new this.DTO.BlogCommentDTO();
                    //we load the user fields 
                    userDAO = await this.DAO.UserDAO.findById(commentDAO.authorId);
                    if (userDAO) {
                        blogCommentDTO.fromDAO(userDAO);
                    }
                    //we load the comment fields
                    blogCommentDTO.fromDAO(commentDAO);
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

    async newBlog(authorId, blogDTO, errors) {
        let result = await this.validateText(5, blogDTO.postTitle + " " + blogDTO.postText);
        if (!result.ok) {
            errors.push(`Post too offensive: ${result.words.join()}`);
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
        let result = await this.validateText(5, blogDTO.postTitle + " " + blogDTO.postText);
        if (!result.ok) {
            errors.push(`Post too offensive: ${result.words.join()}`);
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
            // if (updaterDAO._id !== postDTO.authorId) {
            if (!(updaterDAO._id).equals(postDTO.authorId)) {
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
        // if (!updaterDAO.isAdmin || updaterDAO.isAuthor) {
        if (!updaterDAO.isAuthor) {
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
        let result = await this.validateText(5, blogCommentDTO.commentText);
        if (!result.ok) {
            errors.push(`Comment too offensive: ${result.words.join()}`);
            return null;
        }
        //Check commentator
        let commentatorDAO = await this.checkCommentator(authorId, errors);
        if (!commentatorDAO) {
            return null;
        }
        let postDAO = await this.DAO.PostDAO.findById(blogId);
        if (!postDAO) {
            errors.push(`Blog '${blogId}' not found`);
            return null;
        }

        let commentDTO = new this.DTO.CommentDTO();
        commentDTO.fromDAO(blogCommentDTO);
        commentDTO.postId = blogId;
        commentDTO.authorId = authorId;
        commentDTO = await this.services.commentsService.createOne(commentDTO, errors);
        if (!commentDTO) {
            return null;
        }
        return await this.getOne(blogId, errors);
    }

    async updateComment(updaterId, blogId, blogCommentDTO, commentId, errors) {
        let result = await this.validateText(5, blogCommentDTO.commentText);
        if (!result.ok) {
            errors.push(`Comment too offensive: ${result.words.join()}`);
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
                let postDAO = await this.DAO.PostDAO.findById(blogId);
                if (!postDAO) {
                    errors.push(`This comment '${commentId}' has no Post`);
                    return null;
                }
                if (updaterId != postDAO.authorId) {
                    errors.push(`You're not the author of the comment '${commentId}'`);
                    return null;
                }
            }
        }
        if (await this.services.commentsService.deleteOne(commentId, errors)) {
            return await this.getOne(blogId, errors);
        }
        return null;
    }

    //#region Aux methods
    async seedBadWords() {
        //if the database is empty we load badwords from assets/badwords.json
        let badWordsDAO = await this.DAO.BadWordDAO.find({}).limit(1);
        if (badWordsDAO) {
            if (badWordsDAO.length == 0) {
                var data = require('../Validator/badWords.json');
                for (let item of data) {
                    let badWordDAO = new this.DAO.BadWordDAO();
                    badWordDAO.word = item.word.trim().toLowerCase();
                    badWordDAO.level = item.level;
                    await badWordDAO.save();
                }
            }
        }
        //seed de users
        let usersDAO = await this.DAO.UserDAO.find({}).limit(1);
        if (usersDAO) {
            if (usersDAO.length == 0) {
                var usersBase = require('../assets/users.json');
                for (let item of usersBase) {
                    let userDAO = new this.DAO.UserDAO();
                    userDAO.email = item.email.trim().toLowerCase();
                    userDAO.nickName = item.nickName;
                    userDAO.normalizedNickName = item.nickName.trim().toLowerCase();
                    userDAO.password = bcrypt.hashSync(item.password);
                    userDAO.isAuthor = item.isAuthor;
                    userDAO.isCommentator = item.isCommentator;
                    userDAO.isBlocked = item.isBlocked;
                    userDAO.isAdmin = item.isAdmin;
                    userDAO.lastLogin = item.lastLogin;
                    userDAO.registerDate = item.registerDate;
                    await userDAO.save();
                }
            }
        }

        usersDAO = await this.DAO.UserDAO.find({
            "nickName": "author1"
        }).limit(1);
        if (usersDAO) {
            if (usersDAO.length > 0) {
                let authorDAO = usersDAO[0];

                let postsDAO = await this.DAO.PostDAO.find({}).limit(1);
                if (postsDAO) {
                    if (postsDAO.length == 0) {
                        var postsBase = require('../assets/posts.json');
                        for (let item of postsBase) {
                            let postDAO = new this.DAO.PostDAO();
                            postDAO.postTitle = item.postTitle;
                            postDAO.postText = item.postText;
                            postDAO.category = item.category;
                            postDAO.authorId = authorDAO.id;
                            postDAO.postDate = item.postDate;
                            postDAO.lastUpdate = item.lastUpdate;
                            await postDAO.save();
                        }
                    }
                }

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

    async validateText(level, value) {
        await this.checkValidator();
        return this.validator.validate(level, value);
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
                console.log("bearersDAO after saved: ", bearersDAO);
            }
            var bearerDTO = new this.DTO.BearerDTO();
            bearerDTO.fromDAO(bearerDAO);
            return bearerDTO;
        } catch (err) {
            errors.push(err.message);
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

    async checkCommentator(authorId, errors) {
        let commentatorDAO = await this.DAO.UserDAO.findById(authorId);
        if (!commentatorDAO) {
            errors.push(`Commentator '${commentatorId}' not found`);
            return null;
        }
        if (commentatorDAO.isBlocked) {
            errors.push(`Commentator '${commentatorId}' is blocked`);
            return null;
        }
        if (!commentatorDAO.isCommentator) {
            errors.push(`Commentator '${commentatorId}' is not a commentator`);
            return null;
        }
        return commentatorDAO;
    }
    //#endregion
}


module.exports = BlogService, JWT_KEY;