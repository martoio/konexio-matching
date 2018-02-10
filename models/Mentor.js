const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Create a new schema
const MentorSchema = new Schema({
    property: type,
});
//create a model and export
const Mentor = mongoose.model('', MentorSchema);

module.exports = Mentor;