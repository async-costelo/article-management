'use strict'

// load modules
const moment = require('moment');
const Model = require('../model/appModels');
const CryptoJS = require("crypto-js");

exports.register_user = async (req, res) => {

    let new_user = new Model.Users(req.body);

    let error_message = {
        error: 1,
        message: 'Please provide valid data'
    }

    // Handle null values via API call 
    if (!new_user.name || !new_user.email || !new_user.password)
        res.status(400).send(error_message);

    else {

        try {

            let user = await Model.Users.registerUser(new_user);
            res.json(user);
        }

        catch (e) {
            res.json(e)
            console.error(e)
        }

    }
}

exports.get_user = async function (req, res) {

    try {

        let user = await Model.Users.fetchUser([req.params.email, req.params.password]);

        res.send(user);
    }
    catch (e) {

        res.send(e)
        console.error(e)

    }
}

exports.authenticate_session = async (req, res) => {

    let email = req.body.email;
    let password = req.body.password;

    let error_message =
    {
        error: 1,
        message: 'Invalid Authentication'

    }

    if (email && password) {
        try {

            let user = await Model.Users.fetchUser([email, password]);

            if (user.bool_ex) {
                req.session.loggedin = true;
                req.session.identifier = user.name;
                res.json(user);
            }
            else
                res.json(error_message);
        }
        catch (e) {

            res.send(e)
            console.error(e)

        }
    }
    else
        res.status(400).send(error_message);


}