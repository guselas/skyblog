const BearerDAO = require('../DAO/BearerDAO');
const UserDAO = require('../DAO/UserDAO');

const WhoAmIDTO = require('../DTO/WhoAmIDTO');


class BlogBearerMW {
    constructor(currentLogins) {
        this.currentLogins = currentLogins;
        this.ST_Forbidden = 403;
    }

    //TODO: isAuthor

    async isAuthor(req, res, next) {
        let ok = false;

        if (ok) {
            next();
        } else {
            res.status(this.ST_Forbidden).send("Unauthorized");
        }
    }

    async isAdmin(req, res, next) {
        let ok = false;


        if (ok) {
            next();
        } else {
            res.status(this.ST_Forbidden).send("Unauthorized");
        }
    }

    async isAuthenticated(req, res, next) {
        let ok = false;


        if (ok) {
            next();
        } else {
            res.status(this.ST_Forbidden).send("Unauthorized");
        }
    }


    async validate(req, res, next) {
        var ok = false;
        if (req.path == "/api/blog/login") {
            next();
        } else
        if (req.path == "/api/blog/register") {
            next();
        } else {
            var authorization = req.headers.authorization;
            if (authorization) {
                var items = authorization.split(" ");
                if (items.length == 2) {
                    if (items[0] == "Bearer") {
                        var bearerId = items[1];
                        if (bearerId) {
                            //Clear out of date logins
                            let index = 0;
                            while (index < this.currentLogins.length) {
                                let item = this.currentLogins[index];
                                if (item.validUntil < new Date()) {
                                    //delete currentLogin
                                    this.currentLogins.splice(index, 1);
                                } else {
                                    //go to next
                                    index++;
                                }
                            }
                            //Find in valids logins
                            for (let item of this.currentLogins) {
                                if (item.id == bearerId) {
                                    ok = true;
                                    item.lastAccess = new Date();
                                    req.currentLogin = item;
                                    break;
                                }
                            }
                        }
                        var bearerDAO = await BearerDAO.findById(bearerId);
                        if (bearerDAO) {
                            if (!ok) {
                                var userDAO = await UserDAO.findById(bearerDAO.userId);
                                if (userDAO) {
                                    let whoAmIDTO = new WhoAmIDTO();
                                    whoAmIDTO.fromDAO(userDAO);
                                    whoAmIDTO.fromDAO(bearerDAO);
                                    whoAmIDTO.lastAccess = new Date();
                                    req.currentLogin = whoAmIDTO;
                                    this.currentLogins.push(whoAmIDTO);
                                    ok = true;
                                }
                            }
                            bearerDAO.lastAccess = new Date();
                            bearerDAO.save();
                        }
                        if (ok) {
                            next();
                            return;
                        }
                    }
                }
            }
            res.status(this.ST_Forbidden).send("Unauthorized");
        }

    }
}


module.exports = BlogBearerMW;