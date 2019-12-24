const mongoose = require('mongoose');
var {
    Schema
} = mongoose;

const PostSchema = new Schema({
    postTitle: String,
    postText: String,
    authorId: mongoose.Types.ObjectId,
    postDate: Date
});

const PostDAO = mongoose.model('Posts', PostSchema);
module.exports = PostDAO;