const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const moment = require("moment");

const app = express();

let port = process.env.PORT || 3000;

mongoose.connect("mongodb+srv://admin-V:q1w2e3r4@v-lytod.mongodb.net/AdvocateDB", {
    useNewUrlParser: true
});

mongoose.set('useFindAndModify', false);

var Schema = mongoose.Schema;
const advocateList = new Schema({
    fname: String,
    lname: String,
    qualification: String,
    address: String,
    mail: String,
    phNo: Number,
    password: String,
    clientCount: {
        type: Number,
        default: 0
    }
});

const clientList = new Schema({
    clientId: Number,
    advocateId: String,
    fname: String,
    lname: String,
    fatherName: String,
    age: Number,
    address: String,
    mail: String,
    phNo: Number,
    caseCount: {
        type: Number,
        default: 1
    },
    caseDetails: [{
        _id: false,
        caseTitle: String,
        caseDesc: String,
        balance: {
            type:Number,
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
            _id: false,
            paid_by: String,
            date: Date,
            actualDate: String,
            purpose: String,
            amount: Number
        }]
    }]
});

const advocateObj = mongoose.model("Advocate", advocateList);
const clientObj = mongoose.model("Client", clientList);


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("home", {
        status: ""
    });
});

app.post("/", (req, res) => {
    let mail = req.body.email;
    let password = req.body.password;
    advocateObj.findOne({
        mail: mail
    }, (err, foundData) => {
        if (err) {
            console.log(err);
            return;
        }
        if (foundData === null) {
            res.render("dummy", {
                status: "Account not found !!",
                id: ""
            });
        } else if (foundData.password !== password) {
            res.render("dummy", {
                status: "e-mail and Password don't match",
                id: ""
            });
        } else {
            res.render("dummy", {
                status: "YES",
                id: foundData._id
            });
        }
    });
});


app.post("/dummy", (req, res) => {
    if (req.body.email === "NULL")
        res.redirect("/signUp");
    else {
        let temp = encodeURIComponent(req.body.id);
        res.redirect("/accountPage?val=" + temp);
    }
});

app.get("/signUp", (req, res) => {
    res.render("signUp");
});

app.post("/signUp", (req, res) => {
    const reqBody = req.body;
    advocateObj.find({
        mail: reqBody.email
    }, (err, foundData) => {
        if (err)
            console.log(err);
        if (foundData.length === 0) {
            const newAdvocate = new advocateObj({
                fname: reqBody.fName,
                lname: reqBody.lName,
                qualification: reqBody.qualification,
                address: reqBody.address,
                mail: reqBody.email,
                phNo: reqBody.phNo,
                password: reqBody.pass
            });
            newAdvocate.save();
            res.render("dummy", {
                status: "YES",
                id: ""
            });
        } else {
            res.render("dummy", {
                status: "NO",
                id: ""
            });
        }
    });
});

app.post("/dummy-one", (req, res) => {
    res.redirect("/");
});

app.get("/accountPage", (req, res) => {
    let ADVOCATE_ID = req.query.val.trim();

    function getAdvocate(id) {
        return advocateObj.findOne({
            _id: id
        }).exec();
    }

    function getClients(id) {
        return clientObj.find({
            advocateId: id
        }).exec();
    }
    let promise = getAdvocate(ADVOCATE_ID);
    var clientList = [];
    promise.then((data) => {
        let promise1 = getClients(ADVOCATE_ID);
        promise1.then((data1) => {
            data1.forEach((item) => {
                clientList.push({
                    name: item.fname + " " + item.lname,
                    _id: item.clientId
                });
            });
            res.render("accountPage", {
                lawyerDetails: {
                    name: data.fname + ' ' + data.lname,
                    qualification: data.qualification,
                    address: data.address,
                    mail: data.mail,
                    phNo: data.phNo,
                    id: ADVOCATE_ID
                },
                clientList: JSON.stringify(clientList)
            });

        });

    });

});

app.post("/accountPage", (req, res) => {
    let clientId = req.body.clientId;
    let advocateId = req.body.advocateId;
    if (req.body.name !== "NULL") {
        let temp = JSON.stringify({
            cId: clientId,
            aId: advocateId,
            active: 1
        });
        res.redirect("/clientData?data=" + temp);
    } else {
        let temp = encodeURIComponent(advocateId);
        res.redirect("/clientSignUp?val=" + temp);
    }

});

app.get("/clientSignUp", (req, res) => {
    let ADVOCATE_ID = req.query.val.trim();
    res.render("clientSignUp", {
        id: ADVOCATE_ID
    });
});

app.post("/clientSignUp", (req, res) => {
    const reqBody = req.body;
    const mail = reqBody.email;
    const phNo = reqBody.phNo;

    let advocateId = reqBody.advocateId.trim();

    function getAdvocate(id) {
        return advocateObj.findOne({
            _id: id
        }).exec();
    }

    let promise = getAdvocate(advocateId);

    let tempId;
    promise.then((data) => {
        tempId = data.clientCount + 1;
        let newClient = new clientObj({
            clientId: tempId,
            advocateId: advocateId,
            fname: reqBody.fName,
            lname: reqBody.lName,
            fatherName: reqBody.FName,
            age: reqBody.age,
            address: reqBody.address,
            mail: mail,
            phNo: phNo,
            caseDetails: [{
                caseTitle: reqBody.caseTitle,
                caseDesc: reqBody.caseDesc
            }]
        });

        function getClientMail(id, ma) {
            return clientObj.findOne({
                advocateId: id,
                mail: ma
            }).exec();
        }

        function getClientPhNo(id, pn) {
            return clientObj.findOne({
                advocateId: id,
                phNo: pn
            }).exec();
        }
        let promise1 = getClientMail(advocateId, mail);
        let promise2 = getClientPhNo(advocateId, phNo);
        promise1.then((data1) => {
            if (data1 === null) {
                promise2.then((data2) => {
                    if (data2 === null) {
                        data.clientCount = tempId;
                        newClient.save();
                        data.save();
                        res.render("dummy", {
                            status: "YES",
                            id: ""
                        });
                    } else {
                        res.render("dummy", {
                            status: "Client already registered with this Contact Number with name " + data2.fname + " " + data2.lname,
                            id: ""
                        });
                    }
                });
            } else {
                res.render("dummy", {
                    status: "Client already registered with this mail-Id with name " + data1.fname + " " + data1.lname,
                    id: ""
                });
            }
        });

    });

});

app.post("/dummy-two", (req, res) => {
    let temp = encodeURIComponent(req.body.advocateId.trim());
    res.redirect("/accountPage?val=" + temp);
});

app.get("/clientData", (req, res) => {
    let data = JSON.parse(req.query.data);
    let clientId = parseInt(data.cId),
        advocateId = data.aId.trim(),
        activeCase = data.active;

    function getAdvocate(id) {
        return advocateObj.findOne({
            _id: id
        }).exec();
    }

    function getClient(cId, aId) {
        return clientObj.findOne({
            clientId: cId,
            advocateId: aId
        }).exec();
    }
    let promise = getAdvocate(advocateId);
    let promise1 = getClient(clientId, advocateId);
    promise.then((data) => {
        promise1.then((data1) => {
            let activeCaseIndex;
            data1.caseDetails.forEach((item, index) => {
                if (item.caseId === activeCase) {
                    data1.activeId = item.caseId;
                    activeCaseIndex = index;
                    return;
                }
            });
            // data.qualification = '(B.A., L.L.B.)';
            data1.lawyerDetails = data;
            data1.active = activeCaseIndex;
            let tempRecords = {
                advocate: [],
                client: []
            };
            data1.caseDetails[activeCaseIndex].recList.forEach((item) => {
                let tempDate = new Date(item.date);
                let actualDate = ('0' + tempDate.getDate()).slice(-2) + '/' +
                    ('0' + (tempDate.getMonth() + 1)).slice(-2) + '/' +
                    tempDate.getFullYear();
                item.actualDate = actualDate;
                if (item.paid_by === "You")
                    tempRecords.advocate.push(item);
                else
                    tempRecords.client.push(item);
            });
            data1.records = tempRecords;
            delete data1.recList;
            res.render("clientData", data1);
        });
    });
});

app.post("/docOp", (req, res) => {
    let reqBody = req.body;
    let clientId = reqBody.clientId,
        advocateId = reqBody.advocateId,
        caseId = parseInt(reqBody.active),
        docName = reqBody.docName,
        docStatus = parseInt(reqBody.docStatus);
        console.log(advocateId+" "+caseId+" "+docName+" "+docStatus);

    function getClient(cId, aId) {
        return clientObj.findOne({
            clientId: cId,
            advocateId: aId
        }).exec();
    }
    let promise = getClient(clientId, advocateId);
    promise.then((data) => {
        data.caseDetails.forEach((item) => {
            if (item.caseId === caseId) {
                if(docStatus === 2){
                    item.docList.push({
                        docName: docName,
                        status: 0
                    });
                    return;
                }
                else{
                    item.docList.forEach((item1, index, arr) => {
                        if(item1.docName === docName){
                            if(docStatus === -1)
                            arr.splice(index, 1);
                            else
                            item1.status = docStatus;
                            return;
                        }
                    });
                }
                return;
            }
        });
        data.save();
        res.send("200");
    });
});

app.post("/caseOpen", (req, res) => {
    let clientId = req.body.clientId,
        advocateId = req.body.advocateId,
        caseId = parseInt(req.body.caseId);
    let temp = JSON.stringify({
        cId: clientId,
        aId: advocateId,
        active: caseId
    });
    res.redirect("/clientData?data=" + temp);
})

app.post("/newCase", (req, res) => {
    let clientId = req.body.clientId,
        advocateId = req.body.advocateId.trim(),
        caseTitle = req.body.caseTitle,
        caseDesc = req.body.caseDesc;

    function getClient(cId, aId) {
        return clientObj.findOne({
            clientId: cId,
            advocateId: aId
        }).exec();
    }
    let promise = getClient(clientId, advocateId);
    promise.then((data) => {
        let newCase = {
            caseId: data.caseCount + 1,
            caseTitle: caseTitle,
            caseDesc: caseDesc,
        };
        data.caseCount += 1;
        data.caseDetails.push(newCase);
        data.save();
        let temp = JSON.stringify({
            cId: clientId,
            aId: advocateId,
            active: data.caseCount
        });
        res.redirect("/clientData?data=" + temp);
    });
});

app.post("/newRec", (req, res) => {
    let reqBody = req.body;
    let clientId = reqBody.clientId,
        advocateId = reqBody.advocateId,
        caseId = parseInt(reqBody.active),
        date = new Date(moment(reqBody.date, "DD/MM/YYYY").format("YYYY-MM-DD"));

    function getClient(cId, aId) {
        return clientObj.findOne({
            clientId: cId,
            advocateId: aId
        }).exec();
    }
    let promise = getClient(clientId, advocateId);
    promise.then((data) => {
        data.caseDetails.forEach((item) => {
            if (item.caseId === caseId) {
                if(reqBody.paid_by === "You")
                item.balance += parseInt(reqBody.amount);
                else
                item.balance -= parseInt(reqBody.amount);
                item.recList.push({
                    paid_by: reqBody.paid_by,
                    date: date,
                    purpose: reqBody.purpose,
                    amount: reqBody.amount,
                });
                return;
            }
        });
        data.save();
    });
    res.send({
        result: "success"
    });
});

app.post("/delete", (req, res) => {
    let reqBody = req.body;
    let clientId = reqBody.clientId,
        advocateId = reqBody.advocateId.trim(),
        caseId = parseInt(reqBody.active),
        paid_by = reqBody.paid_by,
        date = reqBody.date,
        purpose = reqBody.purpose,
        amount = parseInt(reqBody.amount);


    function getClient(cId, aId) {
        return clientObj.findOne({
            clientId: cId,
            advocateId: aId
        }).exec();
    }
    let promise = getClient(clientId, advocateId);
    promise.then((data) => {
        data.caseDetails.forEach((item) => {
            if (item.caseId === caseId) {
                item.recList.forEach((item1, index, arr) => {
                    let paid_by1 = item1.paid_by,
                        tempDate = item1.date,
                        purpose1 = item1.purpose,
                        amount1 = item1.amount;
                    let date1 = ('0' + tempDate.getDate()).slice(-2) + '/' +
                        ('0' + (tempDate.getMonth() + 1)).slice(-2) + '/' +
                        tempDate.getFullYear();
                        if(date1 === date && paid_by === paid_by1 && purpose === purpose1 && amount === amount1){
                            if(paid_by === "You")
                            item.balance -= parseInt(amount1);
                            else
                            item.balance += parseInt(amount1);
                            arr.splice(index, 1);
                            return;
                        }
                });
                return;
            }
        });
        data.save();
    });
    res.send("200");
});



app.listen(port, function () {
    console.log("Successfully connected to port "+port+"!!");
});