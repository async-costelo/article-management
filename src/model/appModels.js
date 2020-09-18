'use strict';

const conn = require('./db');
const CryptoJS = require("crypto-js");

//Article object constructor
var Articles = function (article) {
    this.title = article.title;
    this.description = article.description;
    this.message = article.message;
    this.headerimg = article.headerimg;
    this.thumbnailimg = article.thumbnailimg;
    this.user_id = article.user_id;
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
        resolve(val);
    })

}

// Inserts newly registered User
Users.registerUser = async function (newUser, result) {

    try {

        let existing_user = await conn.executeQuery("SELECT id FROM users WHERE email = ?", newUser.email);

        existing_user = JSON.parse(JSON.stringify(existing_user));

        if (existing_user.length > 0)
            return return_value(false);
        else {
            // Encrypt password
            newUser.password = CryptoJS.AES.encrypt(newUser.password, process.env.SECRET).toString();
            let user = await conn.executeQuery("INSERT INTO users set ?", newUser);
            return return_value(true);
        }
    }
    catch (e) {
        return return_value(e, 1);
    }

};


// Fetch a User
Users.fetchUser = async function (fetchUser) {

    try {

        let user = await conn.executeQuery("SELECT id, name, password FROM users WHERE email = ?", fetchUser[0]);

        // Convert RowPacketData to object and gets first element
        user = JSON.parse(JSON.stringify(user))[0];

        // Decrypt cipher to match our plaintext password
        if (CryptoJS.AES.decrypt(user.password, process.env.SECRET).toString(CryptoJS.enc.Utf8) == fetchUser[1])
            return return_value({ name: user.name, bool_ex: true });
        else
            return return_value(false);

    }
    catch (e) {
        return return_value(e, 1);
    }

};

// Fetch name for profile
Users.fetchName = async function (name) {
    console.log(name)
    try {
        let user = await conn.executeQuery("SELECT id, name FROM users WHERE name = ?", name);

        // Convert RowPacketData to object and gets first element
        user = JSON.parse(JSON.stringify(user))[0]

        return return_value(user);
    }
    catch (e) {
        return return_value(e, 1);
    }
}


Articles.createArticle = async function (Articles) {

    try {

        let user = await conn.executeQuery("SELECT id FROM users WHERE id = ?", Articles.user_id);

        // Convert RowPacketData to object and gets first element
        user = JSON.parse(JSON.stringify(user))[0];

        // Check if user_id is existing from Users table
        if (!user.id)
            return return_value(false);
        else {
            let article = await conn.executeQuery("INSERT INTO articles set ?", Articles);
            return return_value(true);
        }


    }

    catch (e) {
        return return_value(e, 1);
    }
}

Articles.getArticlePerUser = async function (user_id) {
    try {

        let x = await conn.executeQuery("SELECT * FROM articles WHERE user_id = ?", user_id);

        return return_value(x);

    }
    catch (e) {
        return return_value(e, 1);
    }
}

Articles.getAllArticles = async function () {
    try {

        let articles = await conn.executeQuery("SELECT * FROM articles", '');

        // Convert RowPacketData to object and gets first element
        articles = JSON.parse(JSON.stringify(articles))

        return return_value(articles);
    }
    catch (e) {
        return return_value(e, 1);
    }
}

Articles.removeArticlePerUser = async function (user) {

}


module.exports = { Users, Articles }