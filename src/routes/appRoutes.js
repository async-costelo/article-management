'use strict'

module.exports = function (app) {

    const func = require('../controllers/appControllers');

    var crypto = require('crypto'),
        multer = require('multer'),
        path = require('path');

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

    app.post('/api/article', upload.single('uploaded_file'), func.create_article)

    app.route('/api/articles/:uid').get(func.fetch_user_article);

    app.route('/api/articles/:uid/:id').delete(func.delete_user_article);

    app.route('/api/articles/:uid/:id').put();

    app.route('/api/auth').post(func.authenticate_session);

    app.route('/api/register').post(func.register_user);

    app.route('/api/userid').get(func.fetch_name);

};