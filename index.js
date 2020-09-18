// Initialize modules
require('dotenv').config()

const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

// Define our routes and models path
var routes = require(path.join(__dirname, 'src/routes') + '/appRoutes');
var Model = require(path.join(__dirname, 'src/model') + '/appModels');

app.use(express.json());

app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname + '/public')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'src/view/login') + '/login.html');
});

app.get('/profile/:name', function (req, res) {

    if (req.session.loggedin)
        res.sendFile(path.join(__dirname, 'src/view') + '/profile.html');
    else
        res.redirect('/');

    res.end();
});

routes(app); //register the route

app.set("port", process.env.PORT || 3000);

const server = app.listen(app.get("port"), () => {
    console.log("app is running on http://localhost:%d", app.get("port"));
})
