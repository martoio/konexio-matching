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

StudentSchema.methods.isValidPassword = async function (newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.password);
    }catch (error){
        throw new Error(error);
    }
};

StudentSchema.methods.createPassword = async function(newPassword){
    return bcrypt.hash(newPassword, await bcrypt.genSalt(10));
};


//create a model and export
const Student = mongoose.model('student', StudentSchema);
module.exports = Student;