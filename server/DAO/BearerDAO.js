var mongoose = require('mongoose');
const { Schema } = mongoose;

const BearerSchema = new Schema({
    userId: mongoose.Types.ObjectId,
    description: String,
    validUntil : Date,
    lastAccess : Date
})

const BearerDAO =mongoose.model('Bearers', BearerSchema); 
BearerDAO.postSchema = BearerSchema;
module.exports = BearerDAO;
