const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const admin1Schema = new Schema({
    username: String,
    password: String
}, { timestamps: true});

const Admin1 = mongoose.model('Admin1', admin1Schema);

module.exports = Admin1;