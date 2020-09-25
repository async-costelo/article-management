'use strict'

// load modules
const moment = require('moment');
const Model = require('../model/appModels');


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
            res.status(200).json(user);
        }

        catch (e) {
            res.status(500).json(e)
            console.error(e)
        }

    }
}

exports.get_user = async function (req, res) {

    try {

        let user = await Model.Users.fetchUser([req.params.email, req.params.password]);
        res.status(200).json(user);
    }
    catch (e) {

        res.status(500).send(e)
        console.error(e)

    }
}

exports.fetch_name = async function (req, res) {

    try {
        let user = await Model.Users.fetchName(req.session.identifier);
        res.status(200).json(user);
    }
    catch (e) {

        res.status(500).send(e)
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

                let len = (user.name).length / 2;
                let half = (user.name).substring(0, len - 1);

                req.session.loggedin = true;
                req.session.identifier = user.session_name; // Use original hash for session

                user.name = half; // Use half of hash

                delete user.session_name; // Remove AES hash after assigning to identifier

                res.status(200).json(user);
            }
            else
                res.status(401).json(error_message);
        }
        catch (e) {

            res.status(500).send(e)
            console.error(e)

        }
    }
    else
        res.status(401).send(error_message);


}

exports.create_article = async (req, res) => {

    let new_article = new Model.Articles(req.body);

    let error_message = {
        error: 1,
        message: 'Please provide valid data'
    }

    if (req.file != null && (req.file).hasOwnProperty('filename')) {
        new_article.thumbnailimg = '/data/uploads/' + req.file.filename;
    }

    new_article.user_id = req.body.uid;
    new_article.message = req.body.newmessage;

    delete req.body.uid;
    delete req.body.newmessage;

    try {

        await Model.Articles.createArticle(new_article);
        res.redirect('back');
    }
    catch (e) {

        res.error(e)
        console.error(e)

    }

    // // Handle null values via API call 
    // if (!new_article.description || !new_article.message || !new_article.title)
    //     res.status(400).send(error_message);

}

exports.fetch_user_article = async (req, res) => {

    try {

        let user = await Model.Articles.getArticlePerUser(req.params.uid);
        res.json(user);
    }
    catch (e) {

        res.send(e)
        console.error(e)

    }
}

exports.delete_user_article = async (req, res) => {

    try {

        let delete_article = await Model.Articles.removeArticlePerUser([req.params.id, req.params.uid]);
        res.status(200).json(delete_article);
    }
    catch (e) {

        res.status(500).error(e)
        console.error(e)

    }
}