const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const beneficiaryType = {
    name: String,
    //photo to be added
    funds_recieved: Number
}

const schemeType = {
    scheme_name: String,
    money_alloted: Number,
    money_spent: Number,
    yt_video_url: String,
    fee_to_be_paid: Number,
    beneficiaries: [beneficiaryType]
}

const staffType = {
    staff_name: String,
    position: String,
    //photo to be added
    office_contact: String
}

const panchayathSchema = new Schema({
    Pname: String,
    issued_money: Number,
    used_money: Number,
    schemes:[schemeType],

    staff:[staffType]

}, { timestamps: true});

const Panchayath = mongoose.model('Panchayath', panchayathSchema);

module.exports = Panchayath;
