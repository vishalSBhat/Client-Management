const express = require('express');
const router = express.Router();
const cookieParser = require("cookie-parser");
const fetchUser = require('../utils/getUserFromCookie');
const client = require('../model/clientModel');

router.post('/open', (req, res) => {
    res.clearCookie('active');
    const {
        caseId
    } = req.body,
        clientId = parseInt(cookieParser.signedCookie(req.signedCookies.client));

    fetchUser(req.signedCookies.you, user => {
        if (user === null)
            return res.redirect('/');

        client.findOne({
            advocateId: user._id,
            clientId
        }, (err, Client) => {
            if (err) {
                console.log(err);
                return;
            }
            res.cookie('active', caseId);
            res.send(JSON.stringify(Client.caseDetails.filter(item => item.caseId === parseInt(caseId))[0]));
        })
    });
});

router.post('/new', (req, res) => {
    const clientId = parseInt(cookieParser.signedCookie(req.signedCookies.client));

    fetchUser(req.signedCookies.you, user => {
        const {
            caseTitle,
            caseDesc
        } = req.body;

        client.findOne({
            advocateId: user._id,
            clientId
        }, (err, Client) => {
            if (err) {
                console.log(err);
                return;
            }

            Client.caseCount += 1;
            const newCase = {
                caseId: Client.caseCount,
                caseTitle,
                caseDesc,
            };
            Client.caseDetails.push(newCase);
            Client.save();
            res.status(200).send(Client.caseCount.toString());
        });
    });
});

module.exports = router;