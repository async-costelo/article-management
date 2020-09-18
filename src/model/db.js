'use strict';

// Load modules
const mysql = require('mysql');

// Initialize pool
var pool = mysql.createPool({
    connectionLimit: 10, // default = 10
    waitForConnections: true,
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DATABASE,
    debug: true,
});


module.exports.executeQuery = async function (queryst, value = null, callback) {

    return new Promise((resolve) => {
        pool.getConnection(function (err, connection) {

            var query = connection.query(queryst, value),
                contentStream = [];

            if (err) {
                callback(err);
                return;
            }

            query.on('error', function (err) {
                // Handle error, an 'end' event will be emitted after this as well
                query.removeListener('end', onEnd)
                callback(err, {});
                return;
            })
                .on('fields', function (fields) {
                    // the field packets for the rows to follow
                })
                .on('result', function (row) {
                    contentStream.push(row);
                })
                .on('end', onEnd);

            function onEnd() {
                resolve(contentStream)
                connection.release();
                // return;
            }

        });
    });

}