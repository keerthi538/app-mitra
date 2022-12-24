const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const admin2Schema = new Schema({
    username: String,
    password: String,
    panchayath: String
}, { timestamps: true});

const Admin2 = mongoose.model('Admin2', admin2Schema);

module.exports = Admin2;