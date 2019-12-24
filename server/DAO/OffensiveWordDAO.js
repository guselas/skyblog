const mongoose = require('mongoose');
var {Schema} = mongoose;

const OffensiveWordSchema = new Schema({
    word:String,
    level:Number
});

const OffensiveWordDAO = mongoose.model('OffensiveWords', OffensiveWordSchema);
module.exports = OffensiveWordDAO;