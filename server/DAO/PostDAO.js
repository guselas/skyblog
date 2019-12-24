const mongoose = require('mongoose');
var {Schema} = mongoose;

const PostSchema = new Schema({
    title:String,
    text:String,
    authorEmail:String,
    authorName:String,
    date:Date,
    commentId: mongoose.Types.ObjectId
});

const PostDAO = mongoose.model('Posts', PostSchema);
module.exports = PostDAO;