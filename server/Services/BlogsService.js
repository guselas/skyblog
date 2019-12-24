const BaseService = require('./BaseService');

class BlogsService extends BaseService {
    constructor(services) {
        super();
        this.nameService = 'blogsService';
        this.services = services.services;
        this.DAO = services.DAO;
        this.DTO = services.DTO;


    }

/*
        app.get(`${uri}/blog`, this.getAll.bind(this));
        app.get(`${uri}/blog/:blogid`, this.getOne.bind(this));

        app.post(`${uri}/blog/:authorid`, this.newBlog.bind(this));
        app.put(`${uri}/blog/:blogid`, this.updateBlog.bind(this));
        app.delete(`${uri}/blog/:blogid`, this.removeBlog.bind(this));

        app.post(`${uri}/blog/:blogid/comment/:authorid`, this.addComment.bind(this));
        app.put(`${uri}/blog/:blogid/comment/:commentid`, this.updateComment.bind(this));
        app.delete(`${uri}/blog/comment/:commentid`, this.removeComment.bind(this));

*/

async getAll(filter,errors){
    
    
    
    return null;

}


async getOne(blogid,errors){
    
    
    
    return null;

}


async newBlog(authorid, errors) {
    
    
    return null;
}



//#region  Auxiliar Methods
async verifyEmail(userDTO, userDAO) {
    if (userDTO.email != userDAO.email) {
        let emails = await this.DAO.UserDAO.find({ email: userDTO.email }, { email: 1, _id: 1 });
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
    let usersDAO = await this.DAO.UserDAO.find({ email: email });
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
    }
    else {
        return await bcrypt.compare(password, userDAO.password);
    }
}

async createBearer(userId, description, errors) {
    try {
        var filter = {
            userId: userId,
            description: description
        };
        var bearersDAO = await BearerDAO.find(filter);
        var bearerDAO;
        if (bearersDAO) {
            if (bearersDAO.length > 0) {
                bearerDAO = bearersDAO[0];
            }
        }
        if (!bearerDAO) {
            bearerDAO = new BearerDAO();
            var until = new Date();
            until.setFullYear(until.getFullYear() + 1);
            bearerDAO.userId = userId;
            bearerDAO.description = description;
            bearerDAO.validUntil = until;
            bearerDAO = await bearerDAO.save();
        }
        var bearerDTO = new BearerDTO();
        bearerDTO.fromDAO(bearerDAO);
        return bearerDTO;
    } catch (err) {
        errors.push(err.message);
    }
    return null;
}
//#endregion



}


module.exports = BlogsService;