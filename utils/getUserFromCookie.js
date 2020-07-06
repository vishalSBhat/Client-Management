const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const advocate = require('../model/advocateModel');

const getAdvocates = () => (
    advocate.find({}).exec()
);

const fetchUser = async (cookie, callback) => {
    const hash = cookieParser.signedCookie(cookie),
        users = await getAdvocates();

    if (!hash)
        return callback(null);

    for (let i = 0; i < users.length; ++i) {
        if (bcrypt.compareSync(users[i]._id.toString(), hash))
            return callback(users[i]);
    }
    callback(null);
}

module.exports = fetchUser;