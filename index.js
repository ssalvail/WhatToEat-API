// load app server using express
const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

app.use(cors());

// router
const router = require('./routes/suggestion.js');

app.use(bodyParser.json());
app.use(express.static('./public'));
app.use(morgan('short'));

app.get("/", (req, res) => {
    console.log("Responding to /");
    res.send("What To Eat API");
});

app.use(router);

const PORT = process.env.PORT || 3003
// localhost:PORT
app.listen(PORT, () => {
    console.log("Server is listening on: " + PORT);
});