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
    age: {
        type: Number,
    },
    bio: {
        type: String
    },
    location: {
        type: String,
        required: true
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
    interests: {
        type: [String]
    },
    student: {
        type: [Schema.Types.ObjectId],
        ref: 'student'
    },
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


MentorSchema.pre('save', async function(next){
    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }catch (error){
        next(error);
    }
});

MentorSchema.methods.isValidPassword = async function (newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.password);
    }catch (error){
        throw new Error(error);
    }
};

MentorSchema.methods.createPassword = async function(newPassword){
    return bcrypt.hash(newPassword, await bcrypt.genSalt(10));
};


//create a model and export
const Mentor = mongoose.model('mentor', MentorSchema);

module.exports = Mentor;