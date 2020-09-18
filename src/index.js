// Initialize modules
require('dotenv').config()

const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

// Define our routes and models path
var routes = require(path.join(__dirname, 'routes') + '/appRoutes');
var Model = require(path.join(__dirname, 'model') + '/appModels');

app.use(express.json());
app.set("port", process.env.PORT || 3000);



const server = app.listen(app.get("port"), () => {
    console.log("app is running on http://localhost:%d", app.get("port"));
})
