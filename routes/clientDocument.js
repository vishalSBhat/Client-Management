const express = require('express');
const router = express.Router();
const cookieParser = require("cookie-parser");
const fetchUser = require('../utils/getUserFromCookie');
const client = require('../model/clientModel');

router.post("/", (req, res) => {
    const {
        docName,
        status
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
            let responseData;
            Client.caseDetails.forEach((Case) => {
                if (Case.caseId === caseId) {
                    if (status == 2)
                        Case.docList.push({
                            docName,
                            status: 0
                        });
                    else {
                        Case.docList.forEach((doc, index, arr) => {
                            if (doc.docName === docName) {
                                status == -1 ? arr.splice(index, 1) : doc.status = status;
                                return;
                            }
                        });
                    }
                    responseData = [...Case.docList];
                    Client.save();
                    responseData.reverse();
                    return;
                }
            });
            res.status(200).send(JSON.stringify(responseData));
        });
    });
});

module.exports = router;