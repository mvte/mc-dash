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
    res.send({ name: "jan's server"});
});

router.get('/status', (req, res) => {
    axios.get("https://api.mcstatus.io/v2/status/java/play.mvte.net")
    .then(response => {
        res.send(response.data);
    }).catch(err => {
        console.log(err);
        res.send({ error: err });
    });
});


module.exports = router;