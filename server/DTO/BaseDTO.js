var mongoose = require('mongoose');

class BaseDTO {
    constructor() {
        this["$type"] = "BaseDTO";
        this.id = "";
        this.rowVersion = 0;
    }

    putModel() {
        this["$type"] = "Put" + this["$type"];
        return this;
    }

    postModel() {
        this["$type"] = "Post" + this["$type"];
        delete this.id;
        delete this.rowVersion;
        return this;
    }


    setId(recordDAO) {
        this.id = recordDAO._id;
        this.rowVersion = recordDAO.__v;
    }

    fromDAO(recordDAO) {
        this.setId(recordDAO);
        for (let prop in recordDAO) {
            if (prop in this) {
                if (recordDAO[prop] instanceof mongoose.Types.Array) {
                    this[prop] = new Array(...recordDAO[prop]);
                } else {
                    this[prop] = recordDAO[prop];
                }
            }
        }
        return this;
    }

    arraysEquals(a, b) {
        if (a == null && b == null) {
            return true;
        } else if (a == null || b == null) {
            return false;
        } else if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length != b.length) {
                return false;
            } else {
                for (let value of a) {
                    if (!b.includes(value)) {
                        return false;
                    }
                }
                return true;
            }
        } else {
            return false;
        }
    }

    toDAOProperty(recordDAO, property) {
        if (property in recordDAO) {
            if (recordDAO[property] instanceof mongoose.Types.Array) {
                if (property in this) {
                    //actualizamos la propiedad  si o si
                    recordDAO[property] = new Array(...this[property]);
                }
            } else {
                //Garantizar que tenemos la propierty en el DTO y en el DAO
                if (property in this) {

                    //actualizamos la propiedad  si o si
                    recordDAO[property] = this[property];

                }
            }
        }
    }

    toDAO(recordDAO) {
        for (let prop in recordDAO) {
            this.toDAOProperty(recordDAO, prop);
        }
        return recordDAO;
    }

    normalizeDate(recordDate) {
        if (this[recordDate]) {
            try {
                this[recordDate] = new Date(this[recordDate]).toISOString();
            } catch (error) {
                throw new Error(`${recordDate}: "${this[recordDate]}" has an invalid format`);
            }
        }
    }
}

module.exports = BaseDTO;