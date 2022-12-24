const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemeSchema = new Schema({
   name: String,
   yt_url: String,
   fee: Number,
   description: String
}, { timestamps: true});

const Scheme = mongoose.model('scheme', schemeSchema);

module.exports = Scheme;

