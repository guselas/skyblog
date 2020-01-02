const mongoose = require('mongoose');
var {Schema} = mongoose;

const BadWordSchema = new Schema({
    word:String,
    level:Number
});

const BadWordDAO = mongoose.model('BadWords', BadWordSchema);
module.exports = BadWordDAO;