const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const advocate = require('./model/advocateModel');
const fetchUser = require('./utils/getUserFromCookie');
require('dotenv').config();

const app = express(),
    port = process.env.PORT || 3000;

mongoose.connect("mongodb+srv://admin-V:q1w2e3r4@v-lytod.mongodb.net/advocateDB", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
}, err => err ? console.log(err) : console.log('Successfully connected to database'));


app.use(helmet());
app.use(cookieParser(process.env.COOKIE_KEY));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    fetchUser(req.signedCookies.you, user => {
        if (user !== null)
            res.redirect('/account/');
        else
            res.render("home");
    });
});

app.post("/", (req, res) => {
    advocate.findOne({
            mail: req.body.mail
        },
        (err, foundData) => {
            const saltRounds = parseInt(process.env.COOKIE_SALT_ROUNDS);
            bcrypt.hash(foundData._id.toString(), saltRounds).then(id => {
                res.cookie('you', id, {
                    signed: true,
                    maxAge: 3 * 30 * 24 * 60 * 60 * 1000,
                    sameSite: true
                });
                res.redirect("/account/");
            });
        });
});

app.get("/logout", (req, res) => {
    res.clearCookie('you');
    res.redirect("/");
});

app.post("/validate", (req, res) => {
    const {
        mail,
        password
    } = req.body;
    advocate.findOne({
        mail
    }, (err, foundData) => {
        if (err) {
            console.log(err);
            return;
        }
        if (foundData === null) {
            res.send("Account not found !!");
        } else if (!bcrypt.compareSync(password, foundData.password)) {
            res.send("e-mail and Password don't match");
        } else {
            res.status(200).send('success');
        }
    });
});

app.get('/templates', (req, res) => {
    res.render('templates');
});

app.get('/expenses', (req, res) => {
    res.render('expenses');
});

app.use('/sign-up', require('./routes/signUp'));
app.use('/account', require('./routes/accountPage'));
app.use('/client/sign-up', require('./routes/clientSignUp'));
app.use('/client/', require('./routes/clientData'));
app.use('/client-data/document/', require('./routes/clientDocument'));
app.use('/client-data/case/', require('./routes/clientCase'));
app.use('/client-data/record/', require('./routes/clientRecord'));

app.listen(port, console.log("Successfully connected to port " + port + "!!"));