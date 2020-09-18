'use strict'

module.exports = function (app) {

    const func = require('../controllers/appControllers');

    // todoList Routes
    app.route('/contents')
        .get(contentList.get_content);

    app.route('/content/:id')
        .put(contentList.update_content);

    app.route('/mailer')
        .post(contentList.send_email);

    app.route('/logs')
        .get(contentList.get_logs);

};