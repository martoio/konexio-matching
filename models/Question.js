const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Create a new schema
const QuestionSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    poster: {
        type:Schema.Types.ObjectId,
        ref: 'student',
        required: true
    },
    answers: [{
        type: Schema.Types.ObjectId,
        ref: 'answer'
    }],
    postedAt: {
        type: Date,
        default: Date.now
    }
});
//create a model and export
const Question = mongoose.model('question', QuestionSchema);
module.exports = Question;