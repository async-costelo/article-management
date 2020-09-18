'use strict'

module.exports = function (app) {

    const func = require('../controllers/appControllers');


    app.route('/api/articles/:uid').get();

    app.route('/api/articles/:id').delete();

    app.route('/api/articles/:id').put();

    app.route('/api/auth').post(func.authenticate_session);

    app.route('/api/register').post(func.register_user);

    app.route('/api/fetch-id').get(func.fetch_name);

};