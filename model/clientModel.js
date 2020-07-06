const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    clientId: Number,
    advocateId: String,
    fname: String,
    lname: String,
    fatherName: String,
    husbandName: String,
    dob: Date,
    age: Number,
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
    telNo: Number,
    caseCount: {
        type: Number,
        default: 0
    },
    totalBalance: {
        type: Number,
        default: 0
    },
    caseDetails: [{
        _id: false,
        caseTitle: String,
        caseDesc: String,
        active: Boolean,
        balance: {
            type: Number,
            default: 0
        },
        caseId: {
            type: Number,
            default: 1
        },
        docList: [{
            _id: false,
            docName: String,
            status: Boolean
        }],
        recList: [{
            paid_by: String,
            date: Date,
            actualDate: String,
            purpose: String,
            amount: Number
        }]
    }]
});

module.exports = mongoose.model('Client', clientSchema);