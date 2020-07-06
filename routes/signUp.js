const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const advocate = require('../model/advocateModel');

router.get('/', (req, res) => {
    res.render("signUp");
});

router.post('/', (req, res) => {
    const {
        fname,
        lname,
        doorNo,
        homeName,
        streetName,
        areaName,
        village,
        post,
        pinCode,
        taluk,
        district,
        state,
        qualification,
        mail,
        phNo,
        password
    } = req.body,
        address = {
            doorNo,
            homeName,
            streetName,
            areaName,
            village,
            post,
            pinCode,
            taluk,
            district,
            state
        }, saltRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS);

    const newAdvocate = new advocate({
        fname,
        lname,
        qualification,
        address,
        mail,
        phNo,
        password: bcrypt.hashSync(password, saltRounds)
    });
    newAdvocate.save();
    res.redirect('/');
});

router.post('/validate', (req, res) => {
    const {
        mail,
        phNo
    } = req.body;
    advocate.findOne({
        $or: [{
            mail
        }, {
            phNo
        }]
    }, (err, foundData) => {
        if (err)
            console.log(err);
        if (foundData === null)
            res.status(200).send('validated');
        else if (foundData.mail === mail)
            res.send('e-mail already in use');
        else
            res.send('ph-No already in use');
    });
});

module.exports = router;