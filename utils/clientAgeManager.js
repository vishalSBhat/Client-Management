const client = require('../model/clientModel');
const age = require('s-age');

const clientAgeManager = (advocateId, callback) => {
    client.find({
        advocateId
    }, (err, clients) => {
        if (err) {
            console.log(err);
            callback();
            return;
        }
        clients.forEach(Client => {
            if (Client.dob)
                Client.age = age(Client.dob.toLocaleDateString());
            Client.save();
        });
        callback();
    })
}
module.exports = clientAgeManager;