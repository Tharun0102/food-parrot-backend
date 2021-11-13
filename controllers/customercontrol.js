const Customer = require('../models/customer');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const registerCustomer = (req, res) => {

    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        const newUser = new Customer({
            username: req.body.username,
            password: hash
        });
        newUser.save();
        if (err) {
            console.log(err);
        }
        else {
            res.send("Successfully Register ");
        }

    });


}

const getCustomer = (req, res) => {

    const { username, password } = req.body;
    Customer.findOne({ username }, function (err, user) {
        if (user) {
            bcrypt.compare(password, user.password, function (err, result) {
                if (result === true) {
                    res.status(200).send("User Found");
                }
                else {
                    res.status(400).send("Wrong Password");
                }

            })

        }
        else {
            res.send("User Not Found");
        }
    });
}

module.exports = { getCustomer, registerCustomer };