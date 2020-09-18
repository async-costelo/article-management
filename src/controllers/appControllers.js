'use strict'

// load modules
const moment = require('moment');
const Model = require('../model/appModels');

exports.register_user = (req, res) => {

    let new_user = new Model.User(req.body);

    let error_message = {
        error: 1,
        message: 'Please provide valid data'
    }

    // Handle null values via API call 
    if (!new_user.name || !new_user.email || !new_user.password) {
        res.status(400).send(error_message);
    }
    else {

        Model.User.registerUser(new_user, function (err, result) {

            if (err)
                res.send(err);

            res.json(result);

        });
    }
}