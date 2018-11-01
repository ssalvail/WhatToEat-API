// will contain all user related routes
const express = require('express');
const mysql = require('mysql');
const router = express.Router();

// returns a random suggestion from the database
router.get("/get_suggestion", (req, res) => {
    const connection = getConnection();

    const queryString = "SELECT * FROM suggestions ORDER BY RAND() LIMIT 1";
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
router.post('/create_suggestion', (req, res) => {
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
        res.end();
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