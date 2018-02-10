const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Create a new schema
const QuestionSchema = new Schema({
    property: type,
});
//create a model and export
const Question = mongoose.model('question', QuestionSchema);
module.exports = Question;