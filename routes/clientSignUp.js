const express = require('express');
const router = express.Router();
const fetchUser = require('../utils/getUserFromCookie');
const client = require('../model/clientModel');

router.get('/', (req, res) => {
    fetchUser(req.signedCookies.you, user => {
        if (user !== null) {
            let address = '';
            for (const [key, value] of Object.entries(user.address))
                if (value !== true && value.trim() !== '')
                    address += `${value}, `
            user._doc.address = address.slice(0, -2);
            res.render("clientSignUp", {
                lawyerDetails: user
            });
        } else
            res.redirect('/');
    });
});

router.post('/', (req, res) => {
    const {
        mail,
        phNo,
        telNo,
        fname,
        lname,
        fatherName,
        husbandName,
        dob,
        age,
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
    } = req.body;

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
    };

    fetchUser(req.signedCookies.you, user => {
        user.clientCount += 1;
        clientId = user.clientCount;
        const newClient = new client({
            clientId,
            advocateId: user._id,
            fname,
            lname,
            fatherName,
            husbandName,
            dob: new Date(dob),
            age,
            address,
            mail,
            phNo,
            telNo,
            caseDetails: []
        });
        newClient.save();
        user.save();
        res.redirect('/account/');
    });
});

router.post('/validate', (req, res) => {
    const {
        mail,
        phNo
    } = req.body;

    fetchUser(req.signedCookies.you, user => {
        client.findOne({
            advocateId: user._id,
            $or: [{
                mail
            }, {
                phNo
            }]
        }, (err, foundData) => {
            const message = field => `Client already registered with this ${field} with name ${foundData.fname} ${foundData.lname}`;
            if (err) {
                console.log(err);
                return;
            }
            if (foundData === null)
                res.send('validated');
            else if (mail === foundData.mail)
                res.send(message('mail-id'));
            else
                res.send(message('Contact Number'));
        })
    });
});

module.exports = router;