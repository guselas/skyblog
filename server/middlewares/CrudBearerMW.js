const HttpStatus = require('http-status-codes');
const UserDAO = require('../DAO/UserDAO');
const jwt = require('jsonwebtoken');
const JWT_KEY = 'secret-key';

const profileDTO = require('../DTO/ProfileDTO');


class CrudBearerMW {
    constructor() { }

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
            res.status(HttpStatus.FORBIDDEN).send("Unauthorized: not author");
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


    // async validate(req, res, next) {
    //     var ok = false;
    //     if (req.path == "/api/V0/login") {
    //         next();
    //     } else {
    //         var authorization = req.headers.authorization;
    //         if (authorization) {
    //             var items = authorization.split(" ");
    //             if (items.length == 2) {
    //                 if (items[0] == "Bearer") {
    //                     var bearerId = items[1];
    //                     if (bearerId) {
    //                         //Clear out of date logins
    //                         let index = 0;
    //                         while (index < this.currentLogins.length) {
    //                             let item = this.currentLogins[index];
    //                             if (item.validUntil < new Date()) {
    //                                 //delete currentLogin
    //                                 this.currentLogins.splice(index, 1);
    //                             } else {
    //                                 //go to next
    //                                 index++;
    //                             }
    //                         }
    //                         //Find in valids logins
    //                         for (let item of this.currentLogins) {
    //                             if (item.id == bearerId) {
    //                                 ok = true;
    //                                 item.lastAccess = new Date();
    //                                 req.currentLogin = item;
    //                                 break;
    //                             }
    //                         }
    //                     }
    //                     var bearerDAO = await BearerDAO.findById(bearerId);
    //                     if (bearerDAO) {
    //                         if (!ok) {
    //                             var userDAO = await UserDAO.findById(bearerDAO.userId);
    //                             if (userDAO) {
    //                                 let profileDTO = new ProfileDTO();
    //                                 profileDTO.fromDAO(userDAO);
    //                                 profileDTO.fromDAO(bearerDAO);
    //                                 profileDTO.lastAccess = new Date();
    //                                 req.currentLogin = profileDTO;
    //                                 this.currentLogins.push(profileDTO);
    //                                 ok = true;
    //                             }
    //                         }
    //                         bearerDAO.lastAccess = new Date();
    //                         bearerDAO.save();
    //                     }
    //                     if (ok) {
    //                         next();
    //                         return;
    //                     }
    //                 }
    //             }
    //         }
    //         res.status(this.ST_Forbidden).send("Unauthorized");
    //     }
    // }
}

module.exports = CrudBearerMW;