const express = require('express');
const router = express.Router();
const fetchUser = require('../utils/getUserFromCookie');
const clientAgeManager = require('../utils/clientAgeManager');
const client = require('../model/clientModel');

router.get('/', (req, res) => {
    res.clearCookie('client');
    res.clearCookie('active');
    fetchUser(req.signedCookies.you, user => {
        let clientList = [],
            address = '';
        if (user === null) {
            res.clearCookie('you');
            return res.redirect('/');
        }

        delete user._doc.password;
        delete user._doc.__v;

        clientAgeManager(user._id, () => {
            client.find({
                advocateId: user._id
            }, (err, clients) => {
                if (err) {
                    console.log(err);
                    clientList = [];
                }
                clients.forEach(data => {
                    const {
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
                    } = data.address,
                        address = new Array(doorNo, homeName, streetName, areaName, village, post, pinCode, taluk, district, state)
                        .filter(val => val.trim() !== '');
                    data._doc.address = address.join(', ').slice(0, -2);
                    clientList.push(data);
                });
                for (const [key, value] of Object.entries(user.address))
                    if (value !== true && value.trim() !== '')
                        address += `${value}, `
                user._doc.address = address.slice(0, -2);

                res.render("accountPage", {
                    lawyerDetails: {
                        ...user._doc
                    },
                    clientList: JSON.stringify(clientList)
                });
            })
        });


    });
});

module.exports = router;