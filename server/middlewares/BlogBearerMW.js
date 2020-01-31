const HttpStatus = require('http-status-codes');
const UserDAO = require('../DAO/UserDAO');
const jwt = require('jsonwebtoken');
const JWT_KEY = 'secret-key';

class BlogBearerMW {
    constructor() {}

    async loadUser(req, res, next) {
        if (req.header('Authorization')) {
            if (req.header('Authorization').indexOf('Bearer') >= 0) {
                const token = req.header('Authorization').replace('Bearer ', '');
                try {
                    const userPayLoad = jwt.verify(token, JWT_KEY);
                    let userDAO = await UserDAO.findById(userPayLoad._id);
                    req.userDAO = userDAO;      
                } catch (error) {
                    res.status(HttpStatus.BAD_REQUEST).send(error.message);
                }
            }
        }
        next();
    }

    isAuthor(req, res, next) {
        let ok = false;
        if (req.userDAO) {
            if (req.userDAO.isAuthor) {
                ok = true;
            }
        }
        if (ok) {
            next();
        } else {
            res.status(HttpStatus.FORBIDDEN).send("Unauthorized: not an author");
        }
    }

    isCommentator(req, res, next) {
        let ok = false;
        if (req.userDAO) {
            if (req.userDAO.isCommentator) {
                ok = true;
            }
        }
        if (ok) {
            next();
        } else {
            res.status(HttpStatus.FORBIDDEN).send("Unauthorized: not a Commentator");
        }
    }

    isAdmin(req, res, next) {
        let ok = false;
        if (req.userDAO) {
            if (req.userDAO.isAdmin) {
                ok = true;
            }
        }
        if (ok) {
            next();
        } else {
            res.status(HttpStatus.FORBIDDEN).send("Unauthorized: not admin");
        }
    }

    isAuthenticated(req, res, next) {
        let ok = false;
        if (req.userDAO) {
            ok = true;
        }
        if (ok) {
            next();
        } else {
            res.status(HttpStatus.FORBIDDEN).send("Unauthorized: not authenticated");
        }
    }

}


module.exports = BlogBearerMW;