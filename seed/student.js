require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.DB);
const Mentor = require('../models/Mentor');
const Student = require('../models/Student');
const faker = require('faker');
const Question = require('../models/Question');

let s = ['5a7ed06288fc50a03c678910', '5a7ecfe557e661a1782e318e'];

let Q = new Question({
    question: faker.lorem.sentences(),
    description: faker.lorem.paragraph(),
    poster: faker.random.arrayElement(s)
});

Q.save(function(err){
    if(err){
        throw err;
    }
    return;
});


//
// let allStudents = Student.find({}, function (err, students) {
//     let sIds = students.map((s) => console.log(s._id));
//
//     Mentor.find({}, function (err, mentors) {
//         mentors.map((m) => {
//             console.log(m);
//             m.students.push(faker.random.arrayElement());
//             m.update();
//         });
//
//     });
//
// });
// let s = new Mentor({
//     email: faker.internet.email(),
//     name: faker.name.findName(),
//     password: 'admin',
//     age: faker.random.number(),
//     bio: faker.lorem.words(),
//     avatar: faker.image.avatar(),
//     location: faker.address.city() + ", " + faker.address.country()
// });
