// Initialize modules
require('dotenv').config()

const express = require('express'),
    session = require('express-session'),
    path = require('path'),
    app = express(),
    crypto = require('crypto')

var multer = require('multer')

// Define our routes and models path
var routes = require(path.join(__dirname, 'src/routes') + '/appRoutes');
var Model = require(path.join(__dirname, 'src/model') + '/appModels');



var multer = require('multer')

var storage = multer.diskStorage({
    destination: './public/data/uploads/',
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            if (err) return cb(err)
            cb(null, raw.toString('hex') + path.extname(file.originalname))
        })
    }
})

var upload = multer({ storage: storage })

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

// New article per user
app.post('/api/article', upload.single('uploaded_file'), async function (req, res) {

    req.body['thumbnailimg'] = '/data/uploads/' + req.file.filename;
    req.body['user_id'] = req.body.uid;
    delete req.body.uid;

    console.log(req.file, req.body)

    try {
        let article = await Model.Articles.createArticle(req.body);
    }
    catch (e) {
        res.send(e)
        console.error(e)
    }
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

app.set("port", process.env.PORT || 3000);

const server = app.listen(app.get("port"), () => {
    console.log("app is running on http://localhost:%d", app.get("port"));
})
