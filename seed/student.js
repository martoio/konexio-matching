require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.DB);
const Mentor = require('../models/Mentor');
const Student = require('../models/Student');
const faker = require('faker');


let allStudents = Student.find({}, function (err, students) {
    let sIds = students.map((s) => console.log(s._id));

    Mentor.find({}, function (err, mentors) {
        mentors.map((m) => {
            console.log(m);
            m.students.push(faker.random.arrayElement());
            m.update();
        });

    });

});
let s = new Mentor({
    email: faker.internet.email(),
    name: faker.name.findName(),
    password: 'admin',
    age: faker.random.number(),
    bio: faker.lorem.words(),
    avatar: faker.image.avatar(),
    location: faker.address.city() + ", " + faker.address.country()
});
