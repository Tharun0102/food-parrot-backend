const Customer = require('../models/customer');


const registerCustomer = async (req, res) => {
    try {
        const newUser = new Customer({
            username: req.body.username,
            password: req.body.password
        })


        await newUser.save();
        // res.render("adminlogin");
        res.send("Successfully Register ");
    }
    catch (error) {
        res.status(400).send({ error });
    }

}

const getCustomer = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await Customer.findOne({ username });
        if (user && await password === user.password) {
            res.send("User Found");
        }
        else {
            res.send("User Not Found");
        }

    }
    catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

module.exports = { getCustomer, registerCustomer };