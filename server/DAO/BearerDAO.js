
var mongoose = require('mongoose');
const { Schema } = mongoose;

const BearerDAO = new Schema({
    userId: mongoose.Types.ObjectId,
    description: String,
    validUntil : Date,
    lastAccess : Date
})
module.exports = mongoose.model('Bearers', BearerDAO);
