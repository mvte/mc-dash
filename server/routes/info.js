/*
this route serves basic information about the server
including
- server name
- server version
- server address
- players online (and their usernames/icons)
- world seed

 */
const express = require('express');
const router = express.Router();
const axios = require('axios');


router.get('/name', (req, res) => {
    console.log(`[${new Date().toISOString()}]`, "[INFO] received request for /name");
    res.send({ name: "jan's server"});
});

router.get('/status', (req, res) => {
    console.log(`[${new Date().toISOString()}]`, "[INFO] received request for /status");
    axios.get("https://api.mcstatus.io/v2/status/java/play.mvte.net")
    .then(response => {
        res.send(response.data);
    }).catch(err => {
        console.log(`[${new Date().toISOString()}]`, "[ERROR] could not retrieve status: ", err);
        res.send({ error: err });
    });
});


module.exports = router;