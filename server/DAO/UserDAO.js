const mongoose = require('mongoose');
var {Schema} = mongoose;

const UserSchema = new Schema({
    email:String,
    nickName : String,
    //normalizedNickName es un campo que sirve solo para comprobar a nivel de db. Este dato no sube nunca al cliente
    normalizedNickName: String,
    password:String,
    isAuthor:Boolean,
    isCommentator : Boolean,
    isBlocked:Boolean,
    isAdmin:Boolean,
    lastLogin:Date,
    registerDate:Date
});

const UserDAO = mongoose.model('Users', UserSchema);
module.exports = UserDAO;