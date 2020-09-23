// Initialize modules
require('dotenv').config()

const express = require('express'),
    session = require('express-session'),
    path = require('path');

const app = express();

app.set("port", process.env.PORT || 3000);

// Define our routes and models path
var routes = require(path.join(__dirname, 'src/routes') + '/appRoutes');
var Model = require(path.join(__dirname, 'src/model') + '/appModels');


app.use(express.json());

app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }
}));

app.use(express.static(path.join(__dirname + '/public')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'src/view/login') + '/login.html');
});

app.get('/profile/:name', async function (req, res) {

    let user = await Model.Users.fetchName(req.params.name);

    if (req.session.loggedin && user) {
        res.sendFile(path.join(__dirname, 'src/view/profile') + '/profile.html');
    }
    else
        res.redirect('/');
});

app.get('/logout', function (req, res) {

    req.session.destroy(function (err) {
        res.redirect('/');
    })

});

routes(app); //register the route

const server = app.listen(app.get("port"), () => {
    console.log("app is running on http://localhost:%d", app.get("port"));
})
