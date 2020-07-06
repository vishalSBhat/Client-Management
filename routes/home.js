const express = require('express');
const router = express.Router();
const advocate = require('../model/advocateModel');

router.get('/', (req, res) => {
    res.render('home');
});

router.post('/', (req, res) => {
    let mail = req.body.email;
    let password = req.body.password;
    advocate.findOne({
        mail: mail
    }, (err, foundData) => {
        if (err) {
            console.log(err);
            return;
        }
        if (foundData === null) {
            res.send("Account not found !!");
        } else if (foundData.password !== password) {
            res.render("e-mail and Password don't match");
        } else {
            res.render("dummy", {
                status: "YES",
                id: foundData._id
            });
        }
    });
});

module.exports = router;