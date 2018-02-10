/*
The MIT License

Copyright (c) 2010-2018 Google, Inc. http://angularjs.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

 */
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
    avatar: {
        type: String
    },
    bio: {
        type: String
    },
    tracks: [{
        type: Schema.Types.ObjectId,
        ref: 'track'
    }],
    interests: [String],
    mentors: [{
        type: Schema.Types.ObjectId,
        ref: 'mentor'
    }],
    requestedMentor: Boolean
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