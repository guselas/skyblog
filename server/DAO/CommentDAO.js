const mongoose = require('mongoose');
var {
    Schema
} = mongoose;

const CommentSchema = new Schema({
    postId: mongoose.Types.ObjectId,
    commentDate: Date,
    authorId: mongoose.Types.ObjectId,
    isApproved : Boolean,
    commentText: String,
    lastUpdate : Date
});

const CommentDAO = mongoose.model('Comments', CommentSchema);
module.exports = CommentDAO;