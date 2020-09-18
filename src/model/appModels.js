'use strict';

const conn = require('./db');

//Article object constructor
var Article = function (article) {
    this.title = article.title;
    this.description = article.description;
    this.message = article.message;
    this.status = article.status;
    this.thumbnail = article.thumbnail;
    this.created_at = new Date();
};

// User object constructor
var Users = function (user) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    this.date = new Date();
}

// Wraps value in a promise state either pass or fail
let return_value = (val, error = 0) => {

    return new Promise((resolve, reject) => {
        if (error == 1)
            reject(val);

        resolve(val)
    })

}

// Inserts newly registered User
Users.registerUser = async function (newUser, result) {

    let email_exists = await conn.executeQuery("SELECT user FROM users WHERE email = ?", newUser.email);

    if (email_exists) {
        await conn.executeQuery("INSERT INTO users set ?", newUser, function (res) {
            result(res)
        });
    }
    else
        return_value("error", 1);

};

// Fetch a User
Users.fetchUser = async function () {

    try {

        let user = await conn.executeQuery("SELECT user FROM users WHERE email = ? AND password = ?",);

        return_value(user);

    }
    catch (e) {

        return_value(e, 1);

    }

};


module.exports = { Users }