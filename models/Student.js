const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;
//Create a new schema
const StudentSchema = new Schema({
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
    age: {
        type: Number,
    },
    bio: {
        type: String
    },
    tracks: {
        type: [Schema.Types.ObjectId],
        ref: 'track'
    },
    interests: {
        type: [String]
    },
    mentor: {
        type: [Schema.Types.ObjectId],
        ref: 'mentor'
    }
});

StudentSchema.pre('save', function(next){
    try{
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
        next();
    }catch (error){
        next(error);
    }
});

StudentSchema.methods.isValidPassword = function (newPassword) {
    try {
        return bcrypt.compareSync(newPassword, this.password);
    }catch (error){
        throw new Error(error);
    }
};

StudentSchema.methods.createPassword = function(newPassword){
    return bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
};


//create a model and export
const Student = mongoose.model('student', StudentSchema);
module.exports = Student;