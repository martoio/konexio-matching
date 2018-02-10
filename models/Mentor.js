const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
//Create a new schema
const MentorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar:{
        type: String
    },
    age: {
        type: Number,
    },
    bio: {
        type: String
    },
    location: {
        type: String,
    },
    company: {
        type: String
    },
    position: {
        type: String
    },
    experience: {
        type: String
    },
    interests: [String],
    students: [{
        type: Schema.Types.ObjectId,
        ref: 'student'
    }],
    maxNumStudents: {
        type: Number
    },
    maxNumHours: {
        type: Number
    },
    integration: {
        type: Boolean
    }
});


MentorSchema.pre('save', function(next){
    try{
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
        next();
    }catch (error){
        next(error);
    }
});

MentorSchema.methods.isValidPassword = function (newPassword) {
    try {
        return bcrypt.compareSync(newPassword, this.password);
    }catch (error){
        throw new Error(error);
    }
};

MentorSchema.methods.createPassword = function(newPassword){
    return bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
};


//create a model and export
const Mentor = mongoose.model('mentor', MentorSchema);

module.exports = Mentor;