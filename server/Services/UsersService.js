const CrudService = require('./CrudService');

const UserDAO = require('../DAO/UserDAO');
const UserDTO = require('../DTO/UserDTO');
const FullUserDTO = require('../DTO/Full/FullUserDTO');

const WhoAmIDTO = require('../DTO/WhoAmIDTO');

class UserService extends CrudService {
    constructor(services) {
        super('UserService', UserDAO, UserDTO, FullUserDTO, services);
        this.verifyUsers = true;
    }

    async seed() {
        let usersDAO = await UserDAO.find({
            email: 'fr.ruizf@gmail.com'
        }).limit(1);
        if (usersDAO) {
            if (usersDAO.length == 0) {
                let userDAO = new UserDAO();
                userDAO.email = 'fr.ruizf@gmail.com';
                userDAO.nickName = "Guselas";
                userDAO.password = '123';
                userDAO.isAuthor = true;
                userDAO.isBlocked = false;
                userDAO.isAdmin = true;
                userDAO.lastLogin = new Date();
                userDAO.registerDate = new Date();
                await userDAO.save();
            }
        }
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


    async readAll(filter, errors) {
        return super.readAll(filter, errors);
    }

    //Virtual method
    async fillFieldsFullDTO(fullUserDTO, errors) {
        fullUserDTO.posts = await this.loadUserPosts(fullUserDTO.id);
        fullUserDTO.comments = await this.loadUserComments(fullUserDTO.id);

        return fullUserDTO;
    }

    async loadUserPosts(userId, errors) {
        return await this.services.postsService.readAll({
            authorId: userId
        }, errors, true);
    }

    async loadUserComments(userId, errors) {
        return await this.services.commentsService.readAll({
            authorId: userId
        }, errors);
    }

    async canCreateOne(userDTO, errors) {
        userDTO.normalizeEmail();
        if (await this.checkFieldsId(userDTO, errors)) {
            var usersByEmail = await this.findUsersByEmail(userDTO.email, errors);
            if (usersByEmail) {
                if (usersByEmail.length == 0) {
                    return true;
                }
                errors.push(`${this.nameService}.canCreateOne(): Email "${userDTO.email}" duplicated`);
            }
        }
        return false;
    }

    async createOne(userDTO, errors) {
        userDTO.normalizeEmail();
        if (await this.canCreateOne(userDTO, errors)) {
            var userDAO = new this.DAO.UserDAO();
            userDTO.toDAO(userDAO);
            // userDAO.password = bcrypt.hashSync(userDTO.password);
            userDAO.password = userDTO.password;
            userDAO = await userDAO.save();
            userDTO.fromDAO(userDAO);
            return userDTO.putModel();
        }
        return null;
    }

    async canUpdateOne(userDTO, errors) {
        userDTO.normalizeEmail();
        if (await this.checkFieldsId(userDTO, errors)) {
            var userDAO = await this.DAO.UserDAO.findById(id);
            if (userDAO) {
                if (await this.verifyEmail(userDTO, userDAO)) {
                    return true;
                }
                errors.push(`${this.nameService}.canUpdateOne(): email ${userDTO.email} already exists`)
            }
        }
        return false;
    }

    async canDeleteOne(userId, errors) {
        var hasBearers = false;
        //Find Comments
        var bearers = await this.DAO.BearerDAO.find({
            userId: userId
        }).limit(1);
        if (comments) {
            hasBearers = bearers.length > 0;
            if (hasBearers) {
                errors.push(`${this.nameService}.canDelete(): the user has Bearers associated`);
            }
        }

        var hasPosts = false;
        //Find Posts
        var posts = await this.DAO.PostDAO.find({
            authorId: userId
        }).limit(1);
        if (posts) {
            hasPosts = posts.length > 0;
            if (hasPosts) {
                errors.push(`${this.nameService}.canDelete(): the user has Posts associated`);
            }
        }
        var hasComments = false;
        //Find Comments
        var comments = await this.DAO.CommentDAO.find({
            authorId: userId
        }).limit(1);
        if (comments) {
            hasComments = comments.length > 0;
            if (hasComments) {
                errors.push(`${this.nameService}.canDelete(): the user has Comments associated`);
            }
        }
        //other relations

        //end verificaton
        return !hasBearers && !hasPosts && !hasComments;
    }

    //Aux user's methods

    async verifyEmail(userDTO, userDAO) {
        if (userDTO.email != userDAO.email) {
            let emails = await this.DAO.UserDAO.find({
                email: userDTO.email
            }, {
                email: 1,
                _id: 1
            });
            if (emails) {
                for (let email in emails) {
                    if (email._id != userDAO._id) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    async findUsersByEmail(email, errors) {
        email = email.toLowerCase().trim().split(' ').join('');
        let usersDTO = [];
        let usersDAO = await this.DAO.UserDAO.find({
            email: email
        });
        if (usersDAO) {
            for (let userDAO of usersDAO) {
                let userDTO = new this.DTO.UserDTO();
                usersDTO.push(userDTO.fromDAO(userDAO));
            }
        }
        return usersDTO;
    }

    async matchPassword(id, password) {
        var userDAO = await this.DAO.UserDAO.findById(id);
        if (!userDAO) {
            return false;
        } else {
            // return await bcrypt.compare(password, userDAO.password);
            return password == userDAO.password;
        }
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

}
module.exports = UserService;