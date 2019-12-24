const BearerDAO = require('../DAO/BearerDAO');
const UserDAO = require('../DAO/UserDAO');


class BearerMiddleWare {
    constructor() {
        this.currentBearers = [];
        this.ST_Forbidden = 403;
    }

    async validate(req, res, next) {
        if (req.path == "/api/blog/login") {
            next();
        }
        else {
            var authorization = req.headers.authorization;
            if (authorization) {
                var items = authorization.split(" ");
                if (items.length == 2) {
                    if (items[0] == "Bearer") {
                        var bearerId = items[1];
                        if (bearerId) {
                            var ok = false;
                            for (let item of this.currentBearers) {
                                if (item._id == bearerId) {
                                    ok = true;
                                    req.currentUser = item.user;
                                    break;
                                }
                            }
                            if (!ok) {
                                var bearerDAO = await BearerDAO.findById(bearerId);
                                if (bearerDAO) {
                                    var userDAO = await UserDAO.findById(bearerDAO.userId);
                                    if (userDAO) {
                                        bearerDAO.user = userDAO;
                                        req.currentUser = userDAO;
                                        this.currentBearers.push(bearerDAO);
                                        ok = true;
                                    }
                                }
                            }
                            if (ok) {
                                next();
                                return;
                            }
                        }
                    }
                }
            }
            res.status(this.ST_Forbidden).send("Unauthorized");
        }
    }
}

module.exports = BearerMiddleWare;