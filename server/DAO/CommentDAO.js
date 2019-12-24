const mongoose = require('mongoose');
var {
    Schema
} = mongoose;

const CommentSchema = new Schema({
    postId: mongoose.Types.ObjectId,
    commentDate: Date,
    userId: mongoose.Types.ObjectId,
    commentText: String
});

const CommentDAO = mongoose.model('Comments', CommentSchema);
module.exports = CommentDAO;