const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const advocateSchema = new Schema({
    fname: String,
    lname: String,
    qualification: String,
    address: {
        doorNo: String,
        homeName: String,
        streetName: String,
        areaName: String,
        village: String,
        post: String,
        pinCode: String,
        taluk: String,
        district: String,
        state: String
    },
    mail: String,
    phNo: Number,
    password: String,
    clientCount: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Advocate', advocateSchema);