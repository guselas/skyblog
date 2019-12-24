const mongoose = require('mongoose');
var {Schema} = mongoose;

const UserSchema = new Schema({
    email:String,
    password:String,
    isAuthor:Boolean,
    isBlocked:Boolean,
    isAdmin:Boolean,
    lastLogin:Date,
    registerDate:Date
});

const UserDAO = mongoose.model('Users', UserSchema);
module.exports = UserDAO;