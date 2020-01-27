const mongoose = require('mongoose');
var {
    Schema
} = mongoose;

const PostSchema = new Schema({
    postTitle: String,
    postText: String,
    category : String,
    authorId: mongoose.Types.ObjectId,
    postDate: Date,
    lastUpdate : Date,
});

const PostDAO = mongoose.model('Posts', PostSchema);
PostDAO.postSchema = PostSchema;
module.exports = PostDAO;