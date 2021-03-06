// will contain all user related routes
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const router = express.Router();

var whitelist = ['http://localhost:3000', 'https://zen-einstein-79908b.netlify.com']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

// returns a random suggestion from the database
router.get("/get_suggestion", cors(corsOptions), (req, res) => {
    const connection = getConnection();
    let queryString;
    if (req.query.type === "restaurant") {
        queryString = "SELECT * FROM suggestions WHERE type = 'restaurant' ORDER BY RAND() LIMIT 1";
    } else {
        queryString = "SELECT * FROM suggestions WHERE type = 'bar' ORDER BY RAND() LIMIT 1";
    }

    connection.query(queryString, (err, row, fields) => {
        if (err) {
            console.log("Failed to query for suggestion: " + err);
            res.sendStatus(500);
            return;
        }
        console.log("Fetched suggestion successfully");

        res.json(row);
    });
});

// adds a suggestion to the database
router.post('/create_suggestion', cors(corsOptions), (req, res) => {
    console.log("Creating new suggestion...");

    const name = req.body.name;
    const address = req.body.address;
    const type = req.body.type;
    let username = req.body.username;

    // if no username provided, set to anonymous
    if (username == "") {
        username = "anonymous";
    }

    const queryString = "INSERT INTO suggestions (name, address, type, username) VALUES (?, ?, ?, ?)";
    getConnection().query(queryString, [name, address, type, username], (err, results, fields) => {
        if (err) {
            console.log("Failed to insert new suggestion: " + err);
            res.sendStatus(500);
            return;
        }
        console.log("Inserted a new suggestion with id: ", results.insertId);
        res.json({
            'message': 'New suggestion saved!'
        });
    });
});

// database setup
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'us-cdbr-iron-east-01.cleardb.net',
    user: 'b25dc845fbf3a5',
    password: 'cc890ba5',
    database: 'heroku_30a1cea7d14d31a'
});

function getConnection() {
    return pool;
}

module.exports = router;