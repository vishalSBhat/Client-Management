const express = require('express');
const router = express.Router();
const cookieParser = require("cookie-parser");
const fetchUser = require('../utils/getUserFromCookie');
const client = require('../model/clientModel');

router.post('/new', (req, res) => {
    let {
        paid_by,
        date,
        purpose,
        amount
    } = req.body;

    const clientId = parseInt(cookieParser.signedCookie(req.signedCookies.client)),
        caseId = parseInt(req.cookies.active);

    if (!clientId)
        return res.redirect('/account/');
    if (!caseId)
        return res.redirect('/client/');

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
            let responseData = {};
            Client.caseDetails.forEach((item) => {
                if (item.caseId === caseId) {
                    if (paid_by === 'a') {
                        Client.totalBalance += parseInt(amount);
                        item.balance += parseInt(amount);
                    } else {
                        Client.totalBalance -= parseInt(amount);
                        item.balance -= parseInt(amount);
                    }
                    item.recList.push({
                        paid_by,
                        date: new Date(date),
                        purpose,
                        amount,
                    });
                    responseData.recList = item.recList;
                    responseData.balance = item.balance;
                    responseData.totalBalance = Client.totalBalance;
                    return;
                }
            });
            Client.save();
            res.status(200).send(JSON.stringify(responseData));
        });
    });
});

router.post('/delete', (req, res) => {
    const {
        id
    } = req.body,
        clientId = parseInt(cookieParser.signedCookie(req.signedCookies.client)),
        caseId = parseInt(req.cookies.active);

    if (!clientId)
        return res.redirect('/account/');
    if (!caseId)
        return res.redirect('/client/');

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
            let responseData = {};
            Client.caseDetails.forEach((item) => {
                if (item.caseId === caseId) {
                    item.recList.forEach((item1, index, arr) => {
                        if (item1._id.equals(id)) {
                            const amount = parseInt(item1.amount);
                            if (item1.paid_by === 'a') {
                                item.balance -= amount;
                                Client.totalBalance -= amount;
                            } else {
                                item.balance += amount;
                                Client.totalBalance += amount;
                            }
                            arr.splice(index, 1);
                            responseData.recList = item.recList;
                            responseData.balance = item.balance;
                            responseData.totalBalance = Client.totalBalance;
                            return;
                        }
                    });
                    return;
                }
            });
            Client.save();
            res.status(200).send(JSON.stringify(responseData));
        });
    });
});

module.exports = router;